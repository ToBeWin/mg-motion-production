"""Original vector paths extruded as independently animated typographic architecture."""
from pathlib import Path
import bpy,math,json,argparse,sys,time
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
P=Path(__file__).resolve().parent;OUT=P.parent.parent
ap=argparse.ArgumentParser();ap.add_argument('--shot',choices=['unfold','hero'],required=True);ap.add_argument('--frames',nargs='*',type=int);ap.add_argument('--render',action='store_true');ap.add_argument('--samples',type=int,default=32);a=ap.parse_args(sys.argv[sys.argv.index('--')+1:])
D=json.loads((P.parent/'design/design-system.json').read_text())
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=a.samples;s.cycles.use_denoising=True;s.cycles.adaptive_threshold=.04;s.cycles.max_bounces=6
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='METAL'
s.cycles.device='GPU';s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=100;s.render.fps=30
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True;s.render.use_persistent_data=True;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.22
s.view_settings.view_transform='Khronos PBR Neutral';s.view_settings.look='None';s.view_settings.exposure=.0
def rgb(h):
 v=[int(h[i:i+2],16)/255 for i in [0,2,4]];return [x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v]
def mat(name,h,metal,rough):
 m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*rgb(h),1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;return m
blue=mat('Saturated cobalt enamel','0026B8',.78,.28);bs=blue.node_tree.nodes.get('Principled BSDF');bs.inputs['Coat Weight'].default_value=0;bs.inputs['Coat Roughness'].default_value=.26
silver=mat('Fine brushed aluminium','CDD3E0',.88,.29);silver.node_tree.nodes.get('Principled BSDF').inputs['Anisotropic'].default_value=.6
noise=silver.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=250
tex=silver.node_tree.nodes.new('ShaderNodeTexCoord');stretch=silver.node_tree.nodes.new('ShaderNodeVectorMath');stretch.operation='MULTIPLY';stretch.inputs[1].default_value=(1,1,60);silver.node_tree.links.new(tex.outputs['Generated'],stretch.inputs[0]);silver.node_tree.links.new(stretch.outputs[0],noise.inputs[0])
bump=silver.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.09;bump.inputs['Distance'].default_value=.0008;silver.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);silver.node_tree.links.new(bump.outputs[0],silver.node_tree.nodes.get('Principled BSDF').inputs['Normal'])
citron=mat('Citron enamel insert','D6F045',.15,.24);paper=mat('Ivory studio','F7F5EE',0,.57)
root=bpy.data.objects.new('AUREL / typographic structure',None);s.collection.objects.link(root);parts=[]
for p in D['parts']:
 depth=.64 if p['name']!='citron-inlay' else .39;offset=.32 if p['name']=='citron-inlay' else -.04 if p['name']=='crossbar' else 0
 vs=[(x,y+offset,z)for y in [-depth/2,depth/2]for x,z in p['points']];faces=[(0,1,2,3),(7,6,5,4)]+[(i+4,(i+1)%4+4,(i+1)%4,i)for i in range(4)]
 me=bpy.data.meshes.new(p['name']);me.from_pydata(vs,[],faces);me.update();o=bpy.data.objects.new(p['name'],me);s.collection.objects.link(o);o.data.materials.append(citron if p['name']=='citron-inlay' else blue);o.data.materials.append(silver)
 for j,f in enumerate(me.polygons):f.material_index=0 if j==0 else 1
 b=o.modifiers.new('Precision machined bevel','BEVEL');b.width=.025;b.segments=4;b.material=1;o.modifiers.new('Broad face normals','WEIGHTED_NORMAL');o.parent=root;parts.append(o)
profile=[(-100,-.075),(8,-.075)]+[(8+8*math.sin(i*math.pi/48),8*(1-math.cos(i*math.pi/48))-.075)for i in range(1,25)]+[(16,45)]
vs=[(x,y,z)for y,z in profile for x in [-100,100]];fs=[(2*i,2*i+1,2*i+3,2*i+2)for i in range(len(profile)-1)]
me=bpy.data.meshes.new('Seamless cyclorama');me.from_pydata(vs,[],fs);me.update();floor=bpy.data.objects.new('Continuous ivory environment',me);s.collection.objects.link(floor);floor.data.materials.append(paper);floor.is_shadow_catcher=True
for q in me.polygons:q.use_smooth=True

w=bpy.data.worlds.new('Soft white surround');w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(*rgb('EFF3FF'),1);w.node_tree.nodes['Background'].inputs[1].default_value=.28;s.world=w
def aim(o,target):o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,power,size,sy,col,target=(0,0,2.8)):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=sy;d.color=rgb(col);o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;aim(o,target)
area('Large left silk',(-5,-7,10),1800,3,5,'FFFFFF');area('Top silver streak',(3,2,10),1000,3,6,'F4F7FF');area('Right edge',(7,-2,5),1000,1,6,'D4E1FF');area('Front soft fill',(-2,-11,3),110,4,5,'FFFFFF')
flagmat=mat('Invisible reflection control','0A1126',0,.9)
for x in [-6,6]:
 bpy.ops.mesh.primitive_plane_add(size=7,location=(x,-5,5));flag=bpy.context.object;flag.name='Reflection control '+str(x);flag.rotation_euler=(math.pi/2,0,math.radians(x*4));flag.data.materials.append(flagmat);flag.visible_camera=False;flag.visible_shadow=False;flag.visible_diffuse=False
cd=bpy.data.cameras.new('Typographic camera');cam=bpy.data.objects.new('Typographic camera',cd);s.collection.objects.link(cam);s.camera=cam;cd.lens=51;cd.sensor_width=36;cd.dof.use_dof=False
def e(x):x=max(0,min(1,x));return x*x*x*(10+x*(-15+6*x))
def key(o,prop,value,f):setattr(o,prop,value);o.keyframe_insert(data_path=prop,frame=f)
duration=4.8 if a.shot=='unfold' else 5.2;s.frame_start=1;s.frame_end=round(duration*30)
for f in range(1,s.frame_end+1):
 t=(f-1)/30;u=e(t/(duration-1/30))
 if a.shot=='unfold':
  pull=e((t-.3)/2.8);spread=e((t-2.1)/2.0)
  loc=Vector((5.5,-9.4,4.6)).lerp(Vector((7,-17,7.3)),pull);target=Vector((-1.0,0,2.8)).lerp(Vector((0,0,2.8)),pull)
  poses=[(-.85*spread,.2*spread,0),(.85*spread,.2*spread,0),(0,-1.4*spread,.45*spread),(0,.5*spread,1.1*spread)]
  angles=[-10*spread,10*spread,-12*spread,0]
 else:
  q=e((t-.15)/3.7);loc=Vector((0,-21,2.95)).lerp(Vector((6.1,-10.9,4.6)),q);target=Vector((0,0,2.85)).lerp(Vector((-.75,0,2.6)),q)
  poses=[(0,0,0)]*4;angles=[0]*4
 for i,o in enumerate(parts):key(o,'location',poses[i],f);key(o,'rotation_euler',(0,math.radians(angles[i]),0),f)
 cam.location=loc;aim(cam,target);cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(P/('AUREL-v2-'+a.shot+'.blend')))
projection={}
for fr,label in [(1,'start'),(s.frame_end,'end')]:
 s.frame_set(fr);bpy.context.view_layer.update();pts=[]
 for o in parts:
  # Shadow-catcher floor occludes the tilted leg bottoms. Project the visible
  # face after clipping at the studio floor, not the hidden mesh vertices.
  poly=[o.matrix_world@v.co for v in list(o.data.vertices)[:4]];visible=[]
  for prev,cur in zip(poly[-1:]+poly[:-1],poly):
   inside_prev=prev.z>=-.075;inside_cur=cur.z>=-.075
   if inside_prev!=inside_cur:visible.append(prev+(cur-prev)*((-.075-prev.z)/(cur.z-prev.z)))
   if inside_cur:visible.append(cur)
  assert len(visible)==4,(o.name,len(visible))
  pts.append([[round(world_to_camera_view(s,cam,v).x*1920,4),round((1-world_to_camera_view(s,cam,v).y)*1080,4)]for v in visible])
 projection[label]=pts
(P/(a.shot+'-projected.json')).write_text(json.dumps(projection,indent=2))
frames=range(1,s.frame_end+1)if a.render else(a.frames or[]);dest=P/(a.shot+'-frames');dest.mkdir(exist_ok=True);records=[]
for fr in frames:
 out=dest/('%04d.png'%fr)
 if a.render and out.exists():continue
 s.frame_set(fr);s.render.filepath=str(out);started=time.time();bpy.ops.render.render(write_still=True);records.append({'frame':fr,'seconds':round(time.time()-started,2)})
(P/(a.shot+'-render.json')).write_text(json.dumps({'frames':s.frame_end,'records':records,'samples':a.samples,'engine':'Cycles Metal'},indent=2))
