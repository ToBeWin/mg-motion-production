"""Editable 14-second continuous product space. Textures generated from original UI code."""
import bpy,math,sys,argparse,json,time
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view
from pathlib import Path
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--preview',type=int,nargs='*');ap.add_argument('--render',action='store_true');ap.add_argument('--scale',type=int,default=100);args=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=args.scale;s.render.fps=30;s.frame_start=1;s.frame_end=420
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.use_persistent_data=True;s.render.film_transparent=False
s.view_settings.view_transform='Standard';s.view_settings.look='None';s.render.use_motion_blur=True;s.render.motion_blur_shutter=.35
s.eevee.taa_render_samples=32;s.eevee.shadow_ray_count=3
s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.88,.94,.91,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.5
def lin(h):
 a=[int(h[i:i+2],16)/255 for i in (0,2,4)];return tuple(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in a)
def mat(name,color,rough=.5,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*lin(color),1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;return m
paper=mat('Warm porcelain paper','f6f9f5',.6);edge=mat('Anodized sea glass edge','79968c',.24,.45);floor=mat('Seamless neutral stage','e9eee9',.8)
def aim(o,target):
 back=(o.location-Vector(target)).normalized();right=Vector((0,1,0)).cross(back).normalized();up=back.cross(right).normalized();o.rotation_euler=Matrix((right,up,back)).transposed().to_euler()
def rounded(name,w,h,z,r=.10):
 verts=[]
 for x,y,a in [(w/2-r,h/2-r,0),(-w/2+r,h/2-r,90),(-w/2+r,-h/2+r,180),(w/2-r,-h/2+r,270)]:
  for j in range(9):
   angle=math.radians(a+j*90/8);verts.append((x+r*math.cos(angle),y+r*math.sin(angle),z))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],[list(range(len(verts)))]);mesh.update();uv=mesh.uv_layers.new()
 for poly in mesh.polygons:
  for idx in poly.loop_indices:
   v=mesh.vertices[mesh.loops[idx].vertex_index].co;uv.data[idx].uv=(v.x/w+.5,v.y/h+.5)
 o=bpy.data.objects.new(name,mesh);s.collection.objects.link(o);return o
def plate(name,w,h,texture):
 root=bpy.data.objects.new(name,None);s.collection.objects.link(root)
 body=rounded(name+' / beveled body',w,h,0);body.parent=root;body.data.materials.append(paper)
 solid=body.modifiers.new('Paper depth','SOLIDIFY');solid.thickness=.045
 bevel=body.modifiers.new('Continuous soft edge','BEVEL');bevel.width=.018;bevel.segments=3
 front=rounded(name+' / editable UI surface',w,h,.007);front.parent=root
 m=bpy.data.materials.new(name+' / original typography');m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.62;p.inputs['Specular IOR Level'].default_value=0
 tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(P/'textures'/texture));em=m.node_tree.nodes.new('ShaderNodeEmission');m.node_tree.links.new(tex.outputs['Color'],em.inputs['Color']);m.node_tree.links.new(em.outputs[0],m.node_tree.nodes.get('Material Output').inputs['Surface']);front.data.materials.append(m)
 return root
cards=[plate(n,4.2,3.0,n+'.png')for n in ('brief','interview','plan')]
answer=plate('answer',7.56,5.4,'answer.png')
def key(o,t,loc,rot=(0,0,0),scale=1):
 o.location=loc;o.rotation_euler=tuple(math.radians(v)for v in rot);o.scale=(scale,)*3
 for prop in ('location','rotation_euler','scale'):o.keyframe_insert(data_path=prop,frame=round(t*30)+1)
for i,c in enumerate(cards):
 pos=[(-2.9,.8,.3),(.6,.3,.75),(3.9,-.45,.05)][i];rot=[(6,-18,10),(-3,10,-7),(9,21,-14)][i]
 key(c,0,pos,rot,.96);key(c,2.7,(pos[0]-.15,pos[1]+.12,pos[2]),rot,1)
 key(c,5.2,(-4.15,2.0-i*2.1,.12-i*.08),(0,0,0),.66)
 key(c,8.4,(-5.1,2.0-i*2.1,-.10),(0,0,0),.61)
 key(c,11.7,(-5.1,2.0-i*2.1,-.10),(0,0,0),.61)
 key(c,14,(-10.5,2.0-i*2.1,-.5),(0,0,0),.52)
key(answer,0,(3.3,-6,-.7),(0,-10,-5),.3);key(answer,4.0,(3.3,-6,-.7),(0,-10,-5),.3)
key(answer,6.1,(1.5,-.0,.1),(0,-5,0),.86);key(answer,8.4,(1.15,.0,.35),(0,0,0),1)
key(answer,11.7,(1.15,.0,.35),(0,0,0),1);key(answer,14,(0,-6,.0),(0,0,0),.38)
# A physical highlight travels across each source line, then returns to the answer's citation rail.
accent=mat('Signal green','147b62',.25,.25)
for i,c in enumerate(cards):
 hi=rounded('Source highlight '+str(i),3.68,.035,.018,r=.015);hi.data.materials.append(accent);hi.parent=c
 key(hi,0,(0,.012,.0),(0,0,0),.001);key(hi,2.9+i*.24,(0,.012,.0),(0,0,0),.001);key(hi,3.45+i*.24,(0,.012,.0),(0,0,0),1);key(hi,5.6,(0,.012,.0),(0,0,0),1)
# Ground behind the floating content makes penumbra and separation visible.
stage=rounded('Infinite studio',200,200,-1.35,1);stage.data.materials.append(floor)
def area(name,loc,power,size,target=(0,0,0),color=(1,1,1),sizey=None):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.color=color;d.shape='RECTANGLE';d.size=size;d.size_y=sizey or size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;aim(o,target)
area('Broad silk key',(-4,7,10),350,9,sizey=6)
area('Cool edge fill',(7,1,5),150,6,color=(.8,.93,1),sizey=3)
area('Long top reflection',(0,8,2),90,7,sizey=1)
cd=bpy.data.cameras.new('Continuous editorial camera');cam=bpy.data.objects.new('Continuous editorial camera',cd);s.collection.objects.link(cam);s.camera=cam;cd.lens=50;cd.sensor_width=36
for t,loc,target,lens in [(0,(4.0,-2.5,17.8),(.3,0,0),48),(2.7,(3.2,-1.0,17.0),(.4,0,0),49),(5.2,(.3,-.35,19.3),(.3,0,0),50),(8.4,(.3,0,19.3),(.3,0,0),50),(11.7,(.3,0,19.3),(.3,0,0),50),(14,(0,0,19.3),(0,0,0),50)]:
 cam.location=loc;aim(cam,target);cd.lens=lens;cam.keyframe_insert(data_path='location',frame=round(t*30)+1);cam.keyframe_insert(data_path='rotation_euler',frame=round(t*30)+1);cd.keyframe_insert(data_path='lens',frame=round(t*30)+1)
# Bound interpolation around readable holds; auto-clamped handles avoid overshooting product states.
for action in bpy.data.actions:
 try:curves=action.fcurves
 except AttributeError:
  curves=[fc for layer in action.layers for strip in layer.strips for bag in strip.channelbags for fc in bag.fcurves]
 for fc in curves:
  for k in fc.keyframe_points:k.interpolation='BEZIER';k.handle_left_type='AUTO_CLAMPED';k.handle_right_type='AUTO_CLAMPED'
projection=[]
for f in range(1,421):
 s.frame_set(f);row={}
 for i,c in enumerate(cards):
  p=world_to_camera_view(s,cam,c.matrix_world@Vector((2.1,0,.02)));row['source'+str(i)]=[p.x*1920,(1-p.y)*1080]
 for i in range(3):
  p=world_to_camera_view(s,cam,answer.matrix_world@Vector((-3.78,.59-i*.837,.02)));row['answer'+str(i)]=[p.x*1920,(1-p.y)*1080]
 p=world_to_camera_view(s,cam,answer.matrix_world@Vector((3.0,.59,.02)));row['cite']=[p.x*1920,(1-p.y)*1080];projection.append(row)
(P/'projection.json').write_text(json.dumps(projection))
s.frame_set(1);bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(P/'FOCUS_CONTINUOUS.blend'))
if args.preview:
 for f in args.preview:s.frame_set(f);s.render.filepath=str(P/f'preview-{f:04}.png');bpy.ops.render.render(write_still=True)
if args.render:
 d=P/'frames';d.mkdir(exist_ok=True);start=time.time()
 for f in range(1,421):
  s.frame_set(f);s.render.filepath=str(d/f'{f:04}.png');bpy.ops.render.render(write_still=True)
  if f%30==0:print('PROGRESS',f,round(time.time()-start,1),flush=True)
