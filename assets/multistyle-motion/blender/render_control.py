from pathlib import Path
import bpy,sys,argparse,math,json,shutil
from mathutils import Vector
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--render',action='store_true');ap.add_argument('--preview',action='store_true');ap.add_argument('--samples',type=int,default=48);a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.wm.open_mainfile(filepath=str(P/'ORBIT-base.blend'));s=bpy.context.scene
for ob in bpy.data.objects:
 ob.animation_data_clear()
 if ob.data and hasattr(ob.data,'animation_data_clear'):ob.data.animation_data_clear()
cam=s.camera;cam.location=(6.7,-9,8.4);target=Vector((0,0,.45));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=7.8;cam.data.dof.use_dof=False
bpy.data.objects['Optical focus'].location=target
rot=bpy.data.objects['Indexed rotary control'];rot.rotation_euler.z=0
for o in bpy.data.objects:
 if o.type=='MESH' and any(m and m.name=='Graphite studio floor' for m in o.data.materials):
  o.is_shadow_catcher=True
s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.adaptive_threshold=.025;s.cycles.adaptive_min_samples=16;s.cycles.use_denoising=True;s.cycles.denoising_use_gpu=True;s.cycles.max_bounces=10
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1024;s.render.resolution_y=1024;s.render.resolution_percentage=100;s.render.fps=30;s.frame_start=1;s.frame_end=120;s.render.film_transparent=True;s.render.use_motion_blur=False;s.render.use_persistent_data=True
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.color_depth='16';s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
records=[]
for f in range(1,121):
 t=(f-1)/30;u=max(0,min(1,(t-.4)/3));progress=u*u*u*(u*(u*6-15)+10);angle=60*progress
 rot.rotation_euler.z=math.radians(angle);rot.keyframe_insert('rotation_euler',frame=f)
 records.append({'frame':f,'time':t,'degrees':angle,'illustrative_brightness':24+56*progress})
(P.parent/'data/hardware-motion.json').write_text(json.dumps(records,separators=(',',':'))+'\n')
s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(P/'ORBIT-control.blend'))
if a.preview:
 s.frame_set(61);s.render.filepath=str(P/'preview.png');bpy.ops.render.render(write_still=True)
if a.render:
 out=P/'frames';out.mkdir(exist_ok=True);seen={}
 for rec in records:
  f=rec['frame'];dest=out/f'{f:04}.png';key=round(rec['degrees'],7)
  if dest.exists():seen[key]=dest;continue
  if key in seen:shutil.copy2(seen[key],dest);continue
  s.frame_set(f);s.render.filepath=str(dest);bpy.ops.render.render(write_still=True);seen[key]=dest
 (P/'render-record.json').write_text(json.dumps({'engine':'Blender Cycles / Metal','samples':a.samples,'resolution':[1024,1024],'frames':120,'rendered_unique_poses':len(seen),'transparent':True,'static_camera':True,'moving_part':'Indexed rotary control','control_mapping':'24 to 80 percent is an illustrative brightness response, not a calibrated hardware claim'},indent=2)+'\n')
