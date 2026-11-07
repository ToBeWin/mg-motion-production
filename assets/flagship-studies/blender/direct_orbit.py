"""ORBIT v4: five authored camera studies in a bright photographic studio.
Reuses our original manufactured model, never modifies the prior delivery.
"""
from pathlib import Path
import argparse, math, sys, bpy
from mathutils import Vector
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--preview',nargs='*',type=int);ap.add_argument('--render',action='store_true');ap.add_argument('--samples',type=int,default=64);ap.add_argument('--scale',type=int,default=100);ap.add_argument('--start',type=int,default=1);ap.add_argument('--end',type=int,default=600)
a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.wm.open_mainfile(filepath=str(P/'ORBIT-base.blend'))
s=bpy.context.scene
for ob in bpy.data.objects:
 ob.animation_data_clear()
 if ob.data and hasattr(ob.data,'animation_data_clear'):ob.data.animation_data_clear()
root=bpy.data.objects['Precision ORBIT assembly'];root.location=(0,0,0);root.rotation_euler=(0,0,0)
def bs(name):return bpy.data.materials[name].node_tree.nodes.get('Principled BSDF')
def material(name,col,metal,rough):
 m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*col,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;return m
ceramic=material('Warm porcelain dock',(.79,.80,.77),.18,.22)
bpy.data.objects['Low profile dock'].data.materials[0]=ceramic
bs('Micro-brushed titanium').inputs['Base Color'].default_value=(.38,.42,.48,1)
bs('Micro-brushed titanium').inputs['Roughness'].default_value=.21
bs('Diamond-cut polished chamfer').inputs['Roughness'].default_value=.13
bs('Graphite studio floor').inputs['Base Color'].default_value=(.78,.80,.81,1)
bs('Graphite studio floor').inputs['Metallic'].default_value=0
bs('Graphite studio floor').inputs['Roughness'].default_value=.35
bs('Graphite anodized alloy').inputs['Base Color'].default_value=(.065,.08,.11,1)
bs('Smoked sapphire optical face').inputs['Base Color'].default_value=(.56,.72,.94,1)
bs('Smoked sapphire optical face').inputs['Roughness'].default_value=.055
bs('Smoked sapphire optical face').inputs['Transmission Weight'].default_value=.92
blue=material('Cobalt reference mark',(.014,.085,.62),.55,.17)
bpy.data.objects['Amber datum'].data.materials[0]=blue
mark=material('Laser graphite mark',(.10,.13,.18),.35,.38)
for name in ['ORBIT laser signature','Precision small signature']:bpy.data.objects[name].data.materials[0]=mark
face=material('Inner frosted ceramic',(.84,.89,.95),.25,.27)
bpy.data.objects['Recess dark optical well'].data.materials[0]=face
# A real inset indicator under sapphire; the crystal has something to refract.
bpy.ops.mesh.primitive_torus_add(major_segments=192,minor_segments=20,location=(0,0,1.281),major_radius=.70,minor_radius=.016)
o=bpy.context.object;o.name='Cobalt optical register';o.data.materials.append(blue);o.parent=root
for i in range(12):
 th=i*math.tau/12
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=.022,location=(.84*math.sin(th),.84*math.cos(th),1.282))
 o=bpy.context.object;o.name=f'Under-glass minute {i:02}';o.scale.z=.16;o.data.materials.append(mark);o.parent=root
# Actual rotating upper assembly, dock and lower bearing remain fixed.
rot=bpy.data.objects.new('Indexed rotary control',None);s.collection.objects.link(rot);rot.parent=root
for o in list(root.children):
 if o==rot:continue
 if o.name.startswith(('Knurl','Fine radial','Cobalt optical','Under-glass')) or o.name in ['Titanium body','Upper diamond-cut edge','Brushed faceplate','Recess dark optical well','Smoked sapphire cap','Amber datum']:
  o.parent=rot
for t,v in [(0,-8),(3.9,-8),(4,0),(4.8,0),(6.8,36),(7.96,36),(8,36),(10.7,48),(12,48),(14,48),(16,48),(19.97,48)]:
 rot.rotation_euler.z=math.radians(v);rot.keyframe_insert('rotation_euler',frame=round(t*30)+1)
# Controlled reflection cards, with restrained cool / warm separation.
world=s.world;world.node_tree.nodes['Background'].inputs[0].default_value=(.85,.9,1,1);world.node_tree.nodes['Background'].inputs[1].default_value=.13
settings={
 'Tall white strip':((-4,-4,7),1100,1.4,7,(.87,.94,1)),
 'Moving warm softbox':((4,3,6),950,5,.7,(1,.93,.84)),
 'Upper fill':((-1,5,8),650,5,3,(.88,.95,1)),
 'Front rim':((2,-6,3),180,5,.4,(1,1,1))}
for name,(loc,energy,sx,sy,col) in settings.items():
 o=bpy.data.objects[name];o.location=loc;o.rotation_euler=(Vector((0,0,.8))-o.location).to_track_quat('-Z','Y').to_euler();o.data.energy=energy;o.data.size=sx;o.data.size_y=sy;o.data.color=col
light=bpy.data.objects['Moving warm softbox']
for t,loc in [(0,(4,3,6)),(4,(3,4,6)),(8,(2,4,6)),(12,(4,3,6)),(20,(3,3,6))]:light.location=loc;light.keyframe_insert('location',frame=t*30+1)
flagmat=material('Negative fill reflection card',(.007,.009,.014),0,.65)
for name,loc,size,rot in [('Upper reflection flag',(0,0,5),(2.6,3.7,1),(0,0,.4)),('Left reflection flag',(-4,0,3),(2.4,3,1),(0,math.pi/3,0))]:
 bpy.ops.mesh.primitive_plane_add(size=2,location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.scale=size;o.data.materials.append(flagmat);o.visible_camera=False;o.visible_shadow=False
cam=s.camera;focus=bpy.data.objects['Optical focus'];cam.data.dof.use_dof=True
# Cuts occur on optical continuity / rotation landmarks. A sampled pose before
# each cut prevents a Bezier curve flying through the next shot's position.
shots=[
 (1,120,(-3.3,-4.3,2.45),(-2.7,-4.3,2.72),(-.68,-1.28,.93),(-.44,-1.28,.95),92,4.5),
 (121,240,(.2,-2.7,8.0),(.6,-2.4,8.2),(0,0,1.18),(0,0,1.18),75,7.1),
 (241,360,(4.7,-7,3.4),(4.0,-7.1,3.6),(0,0,.72),(0,0,.72),82,6.3),
 (361,480,(8.2,-11.8,10.6),(7.8,-12.3,10.9),(-1.38,0,.52),(-1.65,0,.5),62,8),
 (481,600,(4.5,-11.9,12.9),(4.1,-12.3,13.2),(-1.80,0,.40),(-1.80,0,.40),60,8)]
for start,end,p0,p1,f0,f1,lens,stop in shots:
 for fr,pos,tar in [(start,p0,f0),(end,p1,f1)]:
  cam.location=pos;focus.location=tar;cam.data.lens=lens;cam.data.dof.aperture_fstop=stop
  cam.keyframe_insert('location',frame=fr);focus.keyframe_insert('location',frame=fr);cam.data.keyframe_insert('lens',frame=fr);cam.data.dof.keyframe_insert('aperture_fstop',frame=fr)
for act in bpy.data.actions:
 for layer in act.layers:
  for strip in layer.strips:
   for bag in strip.channelbags:
    for fc in bag.fcurves:
     for k in fc.keyframe_points:
      k.interpolation='LINEAR' if act.name.startswith(('Material camera','Optical focus')) else 'BEZIER';k.handle_left_type='AUTO_CLAMPED';k.handle_right_type='AUTO_CLAMPED'
s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.adaptive_threshold=.02;s.cycles.adaptive_min_samples=16;s.cycles.use_denoising=True;s.cycles.denoising_use_gpu=True;s.cycles.max_bounces=12;s.cycles.glossy_bounces=8;s.cycles.transmission_bounces=10
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=a.scale;s.render.fps=30;s.frame_start=1;s.frame_end=600;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.3;s.render.use_persistent_data=True
# A camera cut must not be integrated across the shutter interval. Keep ordinary
# motion blur, but disable it on the two frames touching each hard cut.
cut_frames={120,121,240,241,360,361,480,481}
s['Motion blur cut frames']='120,121,240,241,360,361,480,481'
s['Final render method']='Use direct_orbit.py: RenderSettings.use_motion_blur is not animatable; the render loop applies the cut-frame setting explicitly.'
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=0
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.color_depth='8'
(P/'previews').mkdir(exist_ok=True);s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(P/'ORBIT-v4.blend'))
for fr in a.preview or []:
 s.frame_set(fr);s.render.use_motion_blur=fr not in cut_frames;s.render.filepath=str(P/'previews'/f'{fr:04}.png');bpy.ops.render.render(write_still=True)
if a.render:
 (P/'frames').mkdir(exist_ok=True)
 for fr in range(a.start,a.end+1):
  dest=P/'frames'/f'{fr:04}.png'
  if dest.exists():continue
  s.frame_set(fr);s.render.use_motion_blur=fr not in cut_frames;s.render.filepath=str(dest);bpy.ops.render.render(write_still=True)
