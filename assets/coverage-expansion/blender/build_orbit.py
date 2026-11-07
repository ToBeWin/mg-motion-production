"""Original four-part concept dial: a functional gesture and constrained disassembly."""
from pathlib import Path
import argparse,json,math,sys,bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--kind',choices=['function','assembly'],required=True);ap.add_argument('--preview',nargs='*',type=int);ap.add_argument('--render',action='store_true');ap.add_argument('--samples',type=int,default=40);ap.add_argument('--start',type=int,default=1)
a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=True;s.cycles.denoising_use_gpu=True;s.cycles.adaptive_threshold=.03;s.cycles.adaptive_min_samples=12;s.cycles.max_bounces=6;s.cycles.glossy_bounces=4
pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='METAL';pref.get_devices()
for d in pref.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=100;s.render.fps=30;s.frame_start=1;s.frame_end=(12 if a.kind=='function' else 14)*30;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.use_persistent_data=True;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.3
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=.25
world=bpy.data.worlds.new('Neutral reflection environment');world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.34,.39,.47,1);world.node_tree.nodes['Background'].inputs[1].default_value=.35;s.world=world

def mat(n,c,metal=0,rough=.3):
 m=bpy.data.materials.new(n);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*c,1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;return m
steel=mat('Satin titanium',(.50,.57,.65),1,.25);chrome=mat('Machined bevel',(.77,.83,.91),1,.13);ceramic=mat('Warm ceramic chassis',(.77,.79,.81),.2,.27);pcbmat=mat('Cobalt PCB',(.022,.09,.19),.35,.27);gold=mat('Gold plated contacts',(.68,.39,.08),.9,.2);ink=mat('Etched indices',(.065,.09,.13),.35,.35);accent=mat('Cobalt datum',(.025,.12,.63),.3,.19)
bs=steel.node_tree.nodes.get('Principled BSDF');bs.inputs['Anisotropic'].default_value=.35
noise=steel.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=600;bump=steel.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.0008;steel.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);steel.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
def group(n):o=bpy.data.objects.new(n,None);s.collection.objects.link(o);return o
def polish(o,w=.025):
 b=o.modifiers.new('Tool edge radius','BEVEL');b.width=w;b.segments=4
 for p in o.data.polygons:p.use_smooth=True
 o.modifiers.new('Weighted normals','WEIGHTED_NORMAL');return o
def cylinder(n,r,h,z,m,parent,xy=(0,0),bevel=.025):
 bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=r,depth=h,location=(*xy,z));o=bpy.context.object;o.name=n;o.data.materials.append(m);polish(o,bevel);o.parent=parent;return o
def box(n,dim,loc,m,parent,bevel=.025):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);polish(o,bevel);o.parent=parent;return o
def ring(n,outer,inner,height,z,m,parent):
 N=128;verts=[]
 for zz,rr in [(z-height/2,outer),(z+height/2,outer),(z-height/2,inner),(z+height/2,inner)]:
  verts += [(rr*math.cos(i*2*math.pi/N),rr*math.sin(i*2*math.pi/N),zz) for i in range(N)]
 faces=[]
 for i in range(N):
  j=(i+1)%N;faces += [(i,j,N+j,N+i),(2*N+j,2*N+i,3*N+i,3*N+j),(N+i,N+j,3*N+j,3*N+i),(j,i,2*N+i,2*N+j)]
 me=bpy.data.meshes.new(n);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(n,me);s.collection.objects.link(o);o.data.materials.append(m);o.parent=parent;polish(o,.012);return o
base=group('01 chassis');board=group('02 control board');encoder=group('03 encoder');cap=group('04 rotary cap');groups=[base,board,encoder,cap]
cylinder('Solid ceramic base',1.68,.26,.17,ceramic,base);cylinder('Lower polished lip',1.62,.06,.07,chrome,base);ring('Board seat',1.48,1.31,.13,.365,ceramic,base)
ring('Circuit board with encoder clearance',1.28,.26,.055,.48,pcbmat,board)
for i in range(12):
 th=i*math.tau/12;cylinder('Gold terminal '+str(i),.055,.012,.516,gold,board,(1.08*math.cos(th),1.08*math.sin(th)),.003)
for i in range(4):box('Surface component '+str(i),(.20,.13,.055),(.65*math.cos(i*math.pi/2),.65*math.sin(i*math.pi/2),.545),ink,board,.01)
cylinder('Encoder pedestal',.23,.27,.485,chrome,encoder);cylinder('Optical encoder body',.47,.18,.705,ink,encoder);cylinder('Keyed coupling',.20,.18,.875,chrome,encoder)
ring('Hollow rotary grip',1.44,1.17,.48,1.07,steel,cap);cylinder('Brushed top',1.43,.10,1.36,steel,cap);ring('Top diamond cut',1.46,1.41,.055,1.325,chrome,cap)
for i in range(72):
 th=i*math.tau/72;o=box('Knurl '+str(i),(.038,.06,.37),(1.433*math.cos(th),1.433*math.sin(th),1.06),steel,cap,.007);o.rotation_euler.z=th
for i in range(36):
 th=i*math.tau/36;o=box('Laser index '+str(i),(.012,.13 if i%3==0 else .06,.002),(1.19*math.sin(th),1.19*math.cos(th),1.412),ink,cap,.001);o.rotation_euler.z=-th
box('Cobalt position datum',(.034,.21,.004),(0,1.19,1.416),accent,cap,.005)
# Functional cap rotation uses the same scalar curve exported for the composited UI.
def ease(t,a,b):q=max(0,min(1,(t-a)/(b-a)));return q*q*(3-2*q)
def state(t):
 if a.kind=='function':return {'value':round(20+60*ease(t,3.4,7.6),4),'turn':-.38+1.25*ease(t,3.4,7.6),'parts':[0,0,0,0]}
 return {'value':0,'turn':0,'parts':[0,1.05*(ease(t,3.6,5.3)-ease(t,9.2,10.6)),2.0*(ease(t,2.7,4.5)-ease(t,10,11.4)),3.25*(ease(t,1.8,3.6)-ease(t,10.8,12.6))]}
for f in range(1,s.frame_end+1):
 t=(f-1)/30;st=state(t)
 for i,g in enumerate(groups):g.location=(0,0,st['parts'][i]);g.keyframe_insert(data_path='location',frame=f)
 cap.rotation_euler.z=st['turn'];cap.keyframe_insert(data_path='rotation_euler',frame=f)
floor=mat('Pearl white seamless background',(.88,.90,.93),0,.38);bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.data.materials.append(floor)
def aim(o,pt):o.rotation_euler=(Vector(pt)-o.location).to_track_quat('-Z','Y').to_euler()
def light(n,loc,power,size,y,color):
 d=bpy.data.lights.new(n,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=y;d.color=color;o=bpy.data.objects.new(n,d);s.collection.objects.link(o);o.location=loc;aim(o,(0,0,1))
light('Broad silk',(-3,-4,8),1300,6,5,(1,.96,.91));light('Long polished edge',(4,2,6),1050,6,.75,(.85,.93,1));light('Front reflection card',(4,-6,3),450,2,5,(1,1,1))
camdata=bpy.data.cameras.new('Product camera');cam=bpy.data.objects.new('Product camera',camdata);s.collection.objects.link(cam);s.camera=cam;camdata.lens=62;camdata.dof.use_dof=True;camdata.dof.aperture_fstop=9
focus=group('Optical focus');camdata.dof.focus_object=focus;track=cam.constraints.new('TRACK_TO');track.target=focus;track.track_axis='TRACK_NEGATIVE_Z';track.up_axis='UP_Y'
if a.kind=='function':
 focus.location=(-1.3,0,.85);cam.location=(7,-10,8)
else:
 focus.location=(1.0,0,2.2);cam.location=(9,-15,9.5);camdata.lens=58
s.camera=cam
for act in bpy.data.actions:
 for layer in act.layers:
  for strip in layer.strips:
   for bag in strip.channelbags:
    for fc in bag.fcurves:
     for k in fc.keyframe_points:k.interpolation='LINEAR'
folder=P/a.kind;folder.mkdir(exist_ok=True);rows=[]
for f in range(1,s.frame_end+1):
 s.frame_set(f);st=state((f-1)/30);anchors=[]
 for i,g in enumerate(groups):
  local=Vector((1.3 if i in [0,1,3] else .45,0,[.2,.48,.76,1.36][i]));q=world_to_camera_view(s,cam,g.matrix_world@local);anchors.append([round(q.x*1920,3),round((1-q.y)*1080,3)])
 rows.append({'time':(f-1)/30,'value':st['value'],'turn':st['turn'],'offsets':st['parts'],'anchors':anchors})
(P.parent/'data'/('orbit-'+a.kind+'.json')).write_text(json.dumps(rows,separators=(',',':')))
s.frame_set(1);s.render.filepath='//frames/';bpy.ops.wm.save_as_mainfile(filepath=str(folder/'ORBIT.blend'))
for f in a.preview or []:s.frame_set(f);s.render.filepath=str(folder/f'preview-{f:04d}.png');bpy.ops.render.render(write_still=True)
if a.render:
 (folder/'frames').mkdir(exist_ok=True)
 for f in range(a.start,s.frame_end+1):
  path=folder/'frames'/f'{f:04d}.png'
  if path.exists():continue
  s.frame_set(f);s.render.filepath=str(path);bpy.ops.render.render(write_still=True)
print('ORBIT',a.kind,'ready',flush=True)
