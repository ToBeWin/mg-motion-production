"""Re-light the supplied concept assembly in a neutral, coherent product studio.

The animated geometry and camera are preserved. The delivered eight-second
plate uses original frames 91..330 (3..11 seconds), matching the existing cut.
"""
from pathlib import Path
import argparse,sys,json,time,math,hashlib,shutil
import bpy
from mathutils import Vector

P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser()
ap.add_argument('--preview',nargs='*',type=int,default=[])
ap.add_argument('--render',action='store_true')
ap.add_argument('--samples',type=int,default=64)
ap.add_argument('--scale',type=int,default=100)
a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.wm.open_mainfile(filepath=str(P/'ORBIT-structure-reference.blend'))
s=bpy.context.scene
s.render.engine='CYCLES'
s.cycles.samples=a.samples;s.cycles.use_denoising=True
s.cycles.denoising_use_gpu=True;s.cycles.adaptive_threshold=.018
s.cycles.adaptive_min_samples=16;s.cycles.max_bounces=8
s.cycles.glossy_bounces=6;s.cycles.device='GPU'
s.cycles.use_animated_seed=False
prefs=bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type='METAL';prefs.get_devices()
for device in prefs.devices:device.use=device.type=='METAL'
s.render.resolution_x=1920;s.render.resolution_y=1080
s.render.resolution_percentage=a.scale;s.render.fps=30
s.render.use_persistent_data=True
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
s.render.film_transparent=True
bpy.data.objects['Plane'].is_shadow_catcher=True
s.view_settings.view_transform='AgX'
s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=.35

bg=s.world.node_tree.nodes['Background']
bg.inputs[0].default_value=(.76,.78,.82,1);bg.inputs[1].default_value=.18
def surface(name,color,roughness,metallic):
    b=bpy.data.materials[name].node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value=(*color,1)
    b.inputs['Roughness'].default_value=roughness
    b.inputs['Metallic'].default_value=metallic
    return b
surface('Pearl white seamless background',(.82,.80,.76),.62,0)
steel=surface('Satin titanium',(.38,.41,.45),.24,1)
steel.inputs['Anisotropic'].default_value=.45
surface('Machined bevel',(.72,.76,.80),.17,1)
surface('Warm ceramic chassis',(.68,.69,.68),.36,0)
surface('Cobalt PCB',(.02,.055,.08),.38,.3)
surface('Gold plated contacts',(.55,.34,.12),.27,.85)

key=bpy.data.objects['Broad silk'];key.data.energy=1400
key.data.size=5;key.data.size_y=6;key.data.color=(1,.985,.965)
edge=bpy.data.objects['Long polished edge'];edge.data.energy=1050
edge.data.size=1.5;edge.data.size_y=6;edge.data.color=(.94,.97,1)
front=bpy.data.objects['Front reflection card'];front.data.energy=220
front.data.size=4;front.data.size_y=4;front.data.color=(1,1,1)
def aim(obj,point):obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
data=bpy.data.lights.new('Large overhead studio fill','AREA');data.energy=2500
data.shape='DISK';data.size=18;data.color=(1,.99,.97)
obj=bpy.data.objects.new(data.name,data);s.collection.objects.link(obj)
obj.location=(0,0,11);aim(obj,(0,0,0))

# A narrow reflection flag defines the polished edge, outside the camera image.
mat=bpy.data.materials.new('Cool reflection flag');mat.use_nodes=True
bs=mat.node_tree.nodes.get('Principled BSDF')
bs.inputs['Base Color'].default_value=(.025,.03,.04,1)
bs.inputs['Roughness'].default_value=1
bpy.ops.mesh.primitive_plane_add(size=1,location=(-4.5,-1,3.2))
flag=bpy.context.object;flag.name='Reflection flag outside camera'
flag.dimensions=(4,6,1);flag.data.materials.append(mat);aim(flag,(0,0,2))
flag.visible_camera=False;flag.visible_diffuse=False;flag.visible_shadow=False

out=P/'structure-v9';out.mkdir(exist_ok=True)
s['Revision']='v9: neutral silver, ceramic, studio fill and narrow reflection flag'
s.frame_set(91);s.render.filepath='//structure-v9/'
bpy.ops.wm.save_as_mainfile(filepath=str(P/'ORBIT-structure-v9.blend'))
records=[]
for frame in a.preview:
    s.frame_set(frame);s.render.filepath=str(out/f'preview-{frame:04d}.png')
    start=time.monotonic();bpy.ops.render.render(write_still=True)
    records.append({'original_frame':frame,'seconds':time.monotonic()-start,'path':s.render.filepath})
if a.render:
    (out/'frames').mkdir(exist_ok=True)
    # This scene has rigid object animation only. During the long reading hold,
    # object/camera transforms at f-1, f and f+1 are identical. Reuse that exact
    # render, including its deterministic noise, instead of rerendering a hold.
    assert not any(m.shape_keys for m in bpy.data.meshes)
    assert not any(m.node_tree and m.node_tree.animation_data for m in bpy.data.materials)
    assert not s.world.node_tree.animation_data
    def state_hash(frame):
        s.frame_set(frame);bpy.context.view_layer.update()
        state=[(o.name,[round(x,9) for row in o.matrix_world for x in row]) for o in sorted(s.objects,key=lambda q:q.name)]
        return hashlib.sha256(json.dumps(state,separators=(',',':')).encode()).hexdigest()
    signatures={frame:state_hash(frame) for frame in range(90,332)}
    reused=[];static_frames={}
    for index,frame in enumerate(range(91,331),1):
        dest=out/'frames'/f'{index:04d}.png'
        stable=signatures[frame-1]==signatures[frame]==signatures[frame+1]
        key=signatures[frame] if stable else None
        if dest.exists():
            if stable:static_frames.setdefault(key,dest)
            continue
        if key in static_frames:
            shutil.copy2(static_frames[key],dest)
            reused.append({'output':dest.name,'identical_to':static_frames[key].name,'state_sha256':key})
            continue
        s.frame_set(frame);s.render.filepath=str(dest)
        bpy.ops.render.render(write_still=True)
        if stable:static_frames[key]=dest
        if index%15==0:print('FRAME',index,'/ 240',flush=True)
    (out/'static-frame-reuse.json').write_text(json.dumps({'method':'Rigid object and camera transforms identical at f-1, f and f+1; static geometry, shaders and lights; non-animated render seed','frames':reused},indent=2))
(out/'render-settings.json').write_text(json.dumps({'samples':a.samples,'scale':a.scale,'range':[91,330],'preview':records,'engine':'Cycles / Metal','camera_and_geometry':'preserved from the concept assembly','new_environment':'neutral studio with real area lights and reflection flag'},indent=2))
