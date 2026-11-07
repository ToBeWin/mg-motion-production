"""Two original product-material studies: optical control and precision-machined dial."""
from pathlib import Path
import argparse,sys,math,bpy
from mathutils import Vector

P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--kind',choices=['glass','metal'],required=True);ap.add_argument('--preview',nargs='*',type=int);ap.add_argument('--render',action='store_true');ap.add_argument('--samples',type=int,default=64);ap.add_argument('--scale',type=int,default=100);ap.add_argument('--start',type=int,default=1)
a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--'in sys.argv else [])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=True;s.cycles.adaptive_threshold=.028;s.cycles.adaptive_min_samples=16;s.cycles.max_bounces=12;s.cycles.transmission_bounces=10;s.cycles.transparent_max_bounces=12;s.cycles.glossy_bounces=8;s.cycles.sample_clamp_indirect=8
s.cycles.denoising_use_gpu=True
s.cycles.adaptive_min_samples=8
if a.kind=='metal':s.cycles.max_bounces=8;s.cycles.transmission_bounces=6;s.cycles.glossy_bounces=4
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for dev in prefs.devices:dev.use=dev.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=a.scale;s.render.fps=30;s.frame_start=1;s.frame_end=360;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.color_depth='8';s.render.use_persistent_data=True;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.35
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=.18 if a.kind=='glass'else .3
w=bpy.data.worlds.new('Studio');s.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.78,.83,.9,1) if a.kind=='glass'else(.12,.15,.2,1);w.node_tree.nodes['Background'].inputs[1].default_value=.3 if a.kind=='glass'else .22

def material(name,color,metal=0,rough=.25,trans=0,ior=1.46):
 m=bpy.data.materials.new(name);m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough;bs.inputs['Transmission Weight'].default_value=trans;bs.inputs['IOR'].default_value=ior;return m
def mesh_obj(name,verts,faces,mat):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);s.collection.objects.link(o);o.data.materials.append(mat);return o
def polish(o,width=.04,segments=4):
 b=o.modifiers.new('Precision edge radius','BEVEL');b.width=width;b.segments=segments;b.limit_method='ANGLE';b.angle_limit=.5
 for face in o.data.polygons:face.use_smooth=True
 n=o.modifiers.new('Weighted manufactured normals','WEIGHTED_NORMAL');n.keep_sharp=True;n.weight=45
 return o
def rounded(name,width,height,depth,radius,loc,mat,edge=.025):
 # Extruded true rounded outline: corner radius does not depend on slab thickness.
 outline=[];steps=32
 for cx,cy,start in [(width/2-radius,height/2-radius,0),(-width/2+radius,height/2-radius,90),(-width/2+radius,-height/2+radius,180),(width/2-radius,-height/2+radius,270)]:
  for k in range(steps+1):th=math.radians(start+k*90/steps);outline.append((cx+radius*math.cos(th),cy+radius*math.sin(th)))
 n=len(outline);verts=[(x,y,z)for z in [-depth/2,depth/2]for x,y in outline];faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]+[(i,(i+1)%n,(i+1)%n+n,i+n)for i in range(n)]
 o=mesh_obj(name,verts,faces,mat);o.location=loc;return polish(o,edge,6)
def cylinder(name,rad,depth,loc,mat,vertices=192,bevel=.03):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=rad,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(mat);return polish(o,bevel,5)
def text(name,body,size,loc,mat,parent=None):
 cu=bpy.data.curves.new(name,'FONT');cu.body=body;cu.align_x='CENTER';cu.align_y='CENTER';cu.size=size;cu.extrude=.0008;cu.bevel_depth=.0003;cu.space_character=1.15;o=bpy.data.objects.new(name,cu);s.collection.objects.link(o);o.location=loc;o.data.materials.append(mat);o.parent=parent;return o
def aim(o,point):o.rotation_euler=(Vector(point)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,target,power,size,size_y,color=(1,1,1)):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=size_y;d.color=color;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;aim(o,target);return o
def keys(o,prop,frames):
 for t,v in frames:setattr(o,prop,v);o.keyframe_insert(data_path=prop,frame=t*30+1)
def empty(name):o=bpy.data.objects.new(name,None);s.collection.objects.link(o);return o

camdata=bpy.data.cameras.new('Material camera');cam=bpy.data.objects.new('Material camera',camdata);s.collection.objects.link(cam);s.camera=cam;camdata.lens=65;camdata.dof.use_dof=True;camdata.dof.aperture_blades=9;camdata.dof.aperture_fstop=6.3
focus=empty('Optical focus');camdata.dof.focus_object=focus
tracking=cam.constraints.new('TRACK_TO');tracking.target=focus;tracking.track_axis='TRACK_NEGATIVE_Z';tracking.up_axis='UP_Y'

if a.kind=='glass':
 ceramic=material('Warm white ceramic',(.89,.9,.89),.08,.23)
 satin=material('Satin pale titanium',(.64,.7,.76),.78,.25)
 blue=material('Cobalt ceramic inlay',(.009,.07,.64),.25,.15)
 gray=material('Recess shadow enamel',(.37,.43,.52),.4,.28)
 glass=material('Optical crystal — solid thickness',(.985,.998,1),0,.035,1,1.49)
 nodes=glass.node_tree.nodes;vol=nodes.new('ShaderNodeVolumeAbsorption');vol.inputs['Color'].default_value=(.65,.86,.99,1);vol.inputs['Density'].default_value=.075;glass.node_tree.links.new(vol.outputs[0],nodes.get('Material Output').inputs['Volume'])
 marking=material('Engraved graphite',(.08,.105,.14),.2,.45)
 root=empty('FORM optical control');root.location=(1.45,0,0)
 objects=[]
 objects.append(rounded('Ceramic control chassis',6.8,2.52,.3,1.23,(0,0,.37),ceramic,.055))
 objects.append(rounded('Titanium lower lip',6.72,2.44,.10,1.18,(0,0,.20),satin,.027))
 objects.append(rounded('Recess track',5.65,.27,.065,.13,(0,0,.543),gray,.015))
 blue_track=rounded('Active cobalt segment',1.45,.265,.073,.13,(-2.09,0,.548),blue,.012);objects.append(blue_track)
 lens=rounded('Solid crystal lens',1.94,1.94,.57,.72,(-1.75,0,.88),glass,.12);objects.append(lens)
 for i in range(21):
  x=-2.5+i*.25;tick=rounded('Laser etched tick '+str(i),.012,.09 if i%5 else .17,.002,.005,(x,-.61,.522),marking,.0001);objects.append(tick)
 for o in objects:o.parent=root
 t=text('FORM engraving','F O R M',.135,(-2.14,.72,.525),marking,root)
 t=text('Limit mark','01 / 100',.10,(2.1,.72,.525),marking,root)
 keys(lens,'location',[(0,(-1.75,0,.88)),(5.1,(-1.75,0,.88)),(7.7,(1.65,0,.88)),(12,(1.65,0,.88))])
 # Segment grows from a fixed left edge, staying underneath the refracting lens.
 keys(blue_track,'scale',[(0,(1,1,1)),(5.1,(1,1,1)),(7.7,(3.34,1,1)),(12,(3.34,1,1))])
 keys(blue_track,'location',[(0,(-2.09,0,.548)),(5.1,(-2.09,0,.548)),(7.7,(-.39,0,.548)),(12,(-.39,0,.548))])
 ground=material('Seamless warm white',(.88,.89,.91),0,.32);bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));bpy.context.object.data.materials.append(ground)
 area('Large overhead silk',(-2,-1,7),(1,0,.5),1100,7,4,(1,.97,.92))
 area('Long edge strip',(2,4,5),(1,0,.5),850,7,.7,(.86,.94,1))
 area('Right vertical card',(7,-3,4),(1,0,.6),600,2,5,(1,1,1))
 area('Small optical glint',(-4,2,2),(0,0,.8),160,1.2,3,(.9,.95,1))
 shots=[(0,(-2.8,-2.6,2.7),(-.38,0,.87),72,3.2),(2,(-2.4,-3.4,3.2),(-.25,0,.82),72,4),(5.2,(7.0,-9.7,10.1),(.15,0,.3),58,7.1),(8.2,(6.8,-9.9,10.3),(.0,0,.3),58,7.1),(12,(6.4,-10.2,10.5),(-.12,0,.3),58,7.1)]
 for t,pos,target,lensmm,fstop in shots:
  cam.location=pos;aim(cam,target);cam.keyframe_insert(data_path='location',frame=t*30+1);cam.keyframe_insert(data_path='rotation_euler',frame=t*30+1);focus.location=target;focus.keyframe_insert(data_path='location',frame=t*30+1);camdata.lens=lensmm;camdata.keyframe_insert(data_path='lens',frame=t*30+1);camdata.dof.aperture_fstop=fstop;camdata.dof.keyframe_insert(data_path='aperture_fstop',frame=t*30+1)
else:
 titanium=material('Micro-brushed titanium',(.40,.47,.54),1,.22)
 bs=titanium.node_tree.nodes.get('Principled BSDF');bs.inputs['Anisotropic'].default_value=.45
 nodes=titanium.node_tree.nodes;co=nodes.new('ShaderNodeTexCoord');mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(1,1,1);wave=nodes.new('ShaderNodeTexWave');wave.wave_type='RINGS';wave.rings_direction='Z';wave.inputs['Scale'].default_value=280;wave.inputs['Distortion'].default_value=.18
 bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.002
 titanium.node_tree.links.new(co.outputs['Object'],wave.inputs['Vector']);titanium.node_tree.links.new(wave.outputs['Color'],bump.inputs['Height']);titanium.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
 darkmetal=material('Graphite anodized alloy',(.035,.047,.065),.85,.27)
 chrome=material('Diamond-cut polished chamfer',(.67,.74,.81),1,.10)
 sapphire=material('Smoked sapphire optical face',(.12,.18,.23),.15,.075,.7,1.51)
 marking=material('Etched pale ceramic',(.63,.69,.73),.35,.29)
 accent=material('Warm amber inlay',(.65,.22,.055),.65,.19)
 root=empty('Precision ORBIT assembly');root.location=(1.35,0,0)
 parts=[]
 parts.append(rounded('Low profile dock',6.1,4.4,.26,.7,(0,0,.22),darkmetal,.055))
 parts.append(rounded('Machined bottom chamfer',6.0,4.3,.075,.66,(0,0,.075),chrome,.025))
 parts.append(cylinder('Axle shadow seat',1.95,.16,(0,0,.42),darkmetal,256,.035))
 parts.append(cylinder('Lower polished rim',1.865,.085,(0,0,.53),chrome,256,.025))
 # 120 manufactured teeth, each preserving its editable edge geometry.
 fins=[]
 for i in range(120):
  th=i*2*math.pi/120;o=rounded('Knurl '+str(i),.078,.09,.56,.027,(1.806*math.cos(th),1.806*math.sin(th),.84),titanium,.008);o.rotation_euler.z=th;fins.append(o)
 parts+=fins
 parts.append(cylinder('Titanium body',1.79,.59,(0,0,.84),titanium,256,.035))
 parts.append(cylinder('Upper diamond-cut edge',1.81,.08,(0,0,1.15),chrome,256,.018))
 parts.append(cylinder('Brushed faceplate',1.755,.08,(0,0,1.205),titanium,256,.018))
 parts.append(cylinder('Recess dark optical well',1.11,.06,(0,0,1.247),darkmetal,192,.02))
 parts.append(cylinder('Smoked sapphire cap',1.085,.095,(0,0,1.301),sapphire,192,.043))
 for i in range(48):
  th=i*2*math.pi/48;rr=1.47;o=rounded('Fine radial index '+str(i),.018,.13 if i%4==0 else .055,.002,.008,(rr*math.sin(th),rr*math.cos(th),1.249),marking,.0004);o.rotation_euler.z=-th;parts.append(o)
 o=rounded('Amber datum',.038,.20,.005,.014,(0,1.47,1.252),accent,.001);parts.append(o)
 for o in parts:o.parent=root
 text('ORBIT laser signature','O R B I T',.12,(0,-2.09,.36),marking,root)
 text('Precision small signature','PRECISION / 07',.075,(2.07,1.74,.356),marking,root)
 # A restrained periodic move exposes cuts and reflections, with matching endpoints.
 keys(root,'rotation_euler',[(0,(0,0,math.radians(-9))),(3,(0,0,math.radians(-3))),(6,(0,0,math.radians(3))),(9,(0,0,math.radians(-3))),(12,(0,0,math.radians(-9)))])
 ground=material('Graphite studio floor',(.024,.031,.043),.15,.3);bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));bpy.context.object.data.materials.append(ground)
 area('Tall white strip',(-3,-4,6),(1,0,0),1250,1.2,7,(.86,.94,1))
 sweep=area('Moving warm softbox',(5,2,5),(1,0,.5),1000,5,.8,(1,.89,.74))
 keys(sweep,'location',[(0,(5,2,5)),(3,(4,3,5)),(6,(2,4,5)),(9,(4,3,5)),(12,(5,2,5))])
 area('Upper fill',(-1,5,7),(1,0,.5),650,6,4,(.73,.84,1))
 area('Front rim',(2,-6,2),(1,0,.8),250,5,.4,(1,1,1))
 shots=[(0,(4,-4.4,2.9),(1.1,-1.45,.95),80,4),(1.5,(4.4,-4.8,3.5),(1.12,-1.4,.95),80,4.5),(4.7,(7.3,-9.9,8.4),(-.15,0,.5),55,8),(8,(7.1,-10.1,8.6),(-.15,0,.5),55,8),(12,(4,-4.4,2.9),(1.1,-1.45,.95),80,4)]
 for t,pos,target,lensmm,fstop in shots:
  cam.location=pos;aim(cam,target);cam.keyframe_insert(data_path='location',frame=t*30+1);cam.keyframe_insert(data_path='rotation_euler',frame=t*30+1);focus.location=target;focus.keyframe_insert(data_path='location',frame=t*30+1);camdata.lens=lensmm;camdata.keyframe_insert(data_path='lens',frame=t*30+1);camdata.dof.aperture_fstop=fstop;camdata.dof.keyframe_insert(data_path='aperture_fstop',frame=t*30+1)

for act in bpy.data.actions:
 for layer in act.layers:
  for strip in layer.strips:
   for bag in strip.channelbags:
    for fc in bag.fcurves:
     for k in fc.keyframe_points:k.interpolation='BEZIER';k.handle_left_type='AUTO_CLAMPED';k.handle_right_type='AUTO_CLAMPED'
s.frame_set(1);folder=P/a.kind;folder.mkdir(exist_ok=True);s.render.filepath='//frames/';bpy.ops.wm.save_as_mainfile(filepath=str(folder/(a.kind.upper()+'.blend')))
for frame in a.preview or []:
 s.frame_set(frame);s.render.filepath=str(folder/f'preview-{frame:04}.png');bpy.ops.render.render(write_still=True)
if a.render:
 (folder/'frames').mkdir(exist_ok=True)
 for frame in range(a.start,s.frame_end+1):
  s.frame_set(frame);s.render.filepath=str(folder/'frames'/f'{frame:04}.png');bpy.ops.render.render(write_still=True)
