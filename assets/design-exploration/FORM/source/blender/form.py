import bpy, math, sys, pathlib, argparse, json
from mathutils import Vector
P=pathlib.Path(__file__).resolve().parent
a=argparse.ArgumentParser();a.add_argument('--preview',action='store_true');a.add_argument('--render',action='store_true');a.add_argument('--samples',type=int,default=48);args=a.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=args.samples;s.cycles.use_denoising=True;s.cycles.adaptive_threshold=.025;s.cycles.max_bounces=10;s.cycles.transmission_bounces=8
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=100;s.render.fps=30;s.frame_start=1;s.frame_end=180
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.color_depth='8';s.render.use_persistent_data=True;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.35
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast'
def lin(h):
 vals=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in vals)
def material(name,color,metallic=0,rough=.28,trans=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=(*lin(color),1);n.inputs['Metallic'].default_value=metallic;n.inputs['Roughness'].default_value=rough;n.inputs['Transmission Weight'].default_value=trans;n.inputs['IOR'].default_value=1.46
 if metallic:
  n.inputs['Anisotropic'].default_value=.38
  noise=m.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=180;noise.inputs['Detail'].default_value=2
  bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.08;bump.inputs['Distance'].default_value=.006;m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],n.inputs['Normal'])
 return m
pearl=material('01 / Satin porcelain · warm ivory','E9E6DD',.15,.24)
copper=material('02 / Brushed pale copper','DFAF85',.82,.22)
glass=material('03 / Solid sea glass','76C6B8',0,.09,.95)
teal=material('04 / Mineral enamel','247A73',.38,.25)
floor=material('05 / Warm cyclorama','E9E5DB',0,.65)
root=bpy.data.objects.new('FORM / animated sculpture',None);s.collection.objects.link(root)
def band(name,R,width,twist,phase,mat):
 verts=[];faces=[];N=240;W=20
 for i in range(N):
  u=math.tau*i/N
  for j in range(W+1):
   v=(j/W-.5)*width
   # Full twist keeps a closed orientable surface with clean material edges.
   rr=R+v*math.cos(twist*u+phase)
   verts.append((rr*math.cos(u),rr*math.sin(u),v*math.sin(twist*u+phase)))
 for i in range(N):
  for j in range(W):
   k=i*(W+1)+j;l=((i+1)%N)*(W+1)+j;faces.append((k,l,l+1,k+1))
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();ob=bpy.data.objects.new(name,me);s.collection.objects.link(ob);ob.data.materials.append(mat);ob.parent=root
 for p in me.polygons:p.use_smooth=True
 sol=ob.modifiers.new('Real wall thickness','SOLIDIFY');sol.thickness=.055;sol.offset=0
 bevel=ob.modifiers.new('Machined soft edges','BEVEL');bevel.width=.025;bevel.segments=3
 return ob
outer=band('Porcelain ribbon',2.1,.92,1,0,pearl)
inner=band('Copper ribbon',1.49,.40,1,math.pi*.3,copper)
inner.rotation_euler.z=.4;inner.rotation_euler.x=.36
halo=band('Optical ribbon',2.69,.27,1,.9,glass);halo.rotation_euler.x=-.17;halo.rotation_euler.z=.7
# One restrained contrasting material insert, designed as part of the sculpture.
insert=band('Mineral ribbon',1.0,.26,1,1.4,teal);insert.rotation_euler.x=-.23
root.location=(.6,0,3.0);root.rotation_euler=(math.radians(69),math.radians(7),math.radians(-18))
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));ground=bpy.context.object;ground.name='Continuous warm studio';ground.data.materials.append(floor)
world=bpy.data.worlds.new('Neutral luminous studio');s.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(*lin('E7EFEA'),1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.55
def area(name,loc,power,size,color,target=(.6,0,2.4),sy=None):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=sy or size;d.color=lin(color);o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
area('Large silk / camera left',(-4,-4,9),1500,6,'FFF4E4')
area('Strip / right metal edge',(5,1,6),1900,2.0,'D8EEE7',sy=7)
area('Top soft reflection',(-1,4,9),2200,5,'FFFFFF',sy=2)
area('Front gentle fill',(0,-7,3),400,4,'FFF5E9')
camd=bpy.data.cameras.new('Camera / sculptural reveal');cam=bpy.data.objects.new('Camera / sculptural reveal',camd);s.collection.objects.link(cam);s.camera=cam;camd.lens=58;camd.sensor_width=36
focus=bpy.data.objects.new('Focus / ribbon face',None);s.collection.objects.link(focus);focus.location=(.5,0,3)
camd.dof.use_dof=True;camd.dof.focus_object=focus;camd.dof.aperture_fstop=8
records=[]
for frame in range(1,181):
 t=(frame-1)/179;ease=t*t*(3-2*t)
 root.rotation_euler=(math.radians(69+12*ease),math.radians(7-18*ease),math.radians(-18+56*ease));root.keyframe_insert('rotation_euler',frame=frame)
 inner.rotation_euler.z=.4-.45*ease;inner.keyframe_insert('rotation_euler',frame=frame)
 halo.rotation_euler.z=.7+.33*ease;halo.keyframe_insert('rotation_euler',frame=frame)
 # A short physical dolly reveals changing overlaps; no random camera wandering.
 cam.location=(6.4-2.4*ease,-12.2-5.6*ease,7.9+.2*ease)
 target=Vector((.25,0,2.8));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=frame);cam.keyframe_insert('rotation_euler',frame=frame)
 records.append({'frame':frame,'time':(frame-1)/30,'rotation':list(root.rotation_euler),'camera':list(cam.location)})
s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(P/'FORM.blend'))
(P/'motion.json').write_text(json.dumps(records,separators=(',',':')))
if args.preview:
 s.render.resolution_percentage=60;s.frame_set(160);s.render.filepath=str(P/'preview.png');bpy.ops.render.render(write_still=True)
if args.render:
 dest=P/'frames';dest.mkdir(exist_ok=True)
 for f in range(1,181):
  path=dest/f'{f:04d}.png'
  if path.exists():continue
  s.frame_set(f);s.render.filepath=str(path);bpy.ops.render.render(write_still=True)
