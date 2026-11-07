"""Original SUNPOP can: profiled shell, UV artwork, machined lid, animated tab and condensation."""
from pathlib import Path
import bpy,math,random,argparse,sys,json,time
from mathutils import Vector
P=Path(__file__).resolve().parent
ap=argparse.ArgumentParser();ap.add_argument('--shot',choices=['open','hero','pack'],default='hero');ap.add_argument('--preview',nargs='*',type=int);ap.add_argument('--render',action='store_true');ap.add_argument('--samples',type=int,default=32);ap.add_argument('--scale',type=int,default=100);ap.add_argument('--engine',default='CYCLES');a=ap.parse_args(sys.argv[sys.argv.index('--')+1:] if '--'in sys.argv else [])
bpy.ops.wm.read_factory_settings(use_empty=True);s=bpy.context.scene;s.render.engine=a.engine
if a.engine=='CYCLES':
 s.cycles.samples=a.samples;s.cycles.use_denoising=True;s.cycles.adaptive_threshold=.04;s.cycles.adaptive_min_samples=8;s.cycles.max_bounces=6;s.cycles.transmission_bounces=4;s.cycles.glossy_bounces=4
 prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='METAL'
 s.cycles.device='GPU'
s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=a.scale;s.render.fps=30
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.color_depth='8';s.render.use_persistent_data=True
s.render.use_motion_blur=True;s.render.motion_blur_shutter=.3;s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.55
def linear(h):
 c=[int(h[i:i+2],16)/255 for i in [0,2,4]];return [v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
def mat(name,c,metal=0,rough=.25):
 m=bpy.data.materials.new(name);m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Base Color'].default_value=(*linear(c),1);b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough;return m
al=mat('Brushed aluminium / fine tooling','BEC7D1',.94,.23)
n=al.node_tree.nodes;bs=n.get('Principled BSDF');bs.inputs['Anisotropic'].default_value=.48;noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=240;bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.045;bump.inputs['Distance'].default_value=.0015;al.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);al.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
edge=mat('Polished rolled seam','E2E5E8',1,.16);dark=mat('Opening interior','010205',0,1)
water=mat('Cold condensation / fine droplets','F1F8FF',0,.07);b=water.node_tree.nodes.get('Principled BSDF');b.inputs['Transmission Weight'].default_value=.8;b.inputs['IOR'].default_value=1.333
labels={}
for v in ['blue','orange','cream']:
 m=mat('Printed lacquer / '+v,'FFFFFF',.08,.26);b=m.node_tree.nodes.get('Principled BSDF');b.inputs['Coat Weight'].default_value=.18;b.inputs['Coat Roughness'].default_value=.22
 im=m.node_tree.nodes.new('ShaderNodeTexImage');im.image=bpy.data.images.load(str(P.parent/'design'/('label-'+v+'.png')));im.interpolation='Cubic';m.node_tree.links.new(im.outputs['Color'],b.inputs['Base Color']);labels[v]=m
def empty(name,parent=None):
 o=bpy.data.objects.new(name,None);s.collection.objects.link(o);o.parent=parent;return o
def mesh(name,verts,faces,m,parent):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);s.collection.objects.link(o);o.data.materials.append(m);o.parent=parent
 for p in me.polygons:p.use_smooth=True
 return o
def cylinder(name,r,d,z,m,parent,xy=(0,0)):
 bpy.ops.mesh.primitive_cylinder_add(vertices=128,radius=r,depth=d,location=(xy[0],xy[1],z));o=bpy.context.object;o.name=name;o.data.materials.append(m);o.parent=parent
 b=o.modifiers.new('Rolled edge radius','BEVEL');b.width=.012;b.segments=3
 for p in o.data.polygons:p.use_smooth=True
 return o
def torus(name,r,t,z,m,parent):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=128,minor_segments=12,location=(0,0,z));o=bpy.context.object;o.name=name;o.data.materials.append(m);o.parent=parent
 for f in o.data.polygons:f.use_smooth=True
 return o
def oval(name,rx,ry,z,y,m,parent):
 verts=[(0,y,z)]+[(rx*math.cos(i*math.tau/80),y+ry*math.sin(i*math.tau/80),z)for i in range(80)]
 return mesh(name,verts,[(0,i+1,(i+1)%80+1)for i in range(80)],m,parent)
def can(name,variant='blue'):
 root=empty(name);N=192
 profile=[(-1.70,.50),(-1.68,.56),(-1.61,.61),(-1.51,.65),(-1.40,.663),(1.31,.663),(1.40,.645),(1.51,.595),(1.59,.568),(1.64,.568)]
 vs=[];fs=[]
 for z,r in profile:
  for j in range(N+1):t=math.pi/2+math.tau*j/N;vs.append((r*math.cos(t),r*math.sin(t),z))
 for k in range(len(profile)-1):
  for j in range(N):i=k*(N+1)+j;fs.append((i,i+1,i+N+2,i+N+1))
 body=mesh(name+' / formed printed shell',vs,fs,labels[variant],root);uv=body.data.uv_layers.new(name='Wrap / front centred')
 for poly in body.data.polygons:
  for li in poly.loop_indices:
   idx=body.data.loops[li].vertex_index;k,j=divmod(idx,N+1);uv.data[li].uv=(j/N,max(0,min(1,(profile[k][0]+1.53)/3.06)))
 torus(name+' / bottom foot',.535,.025,-1.69,edge,root);cylinder(name+' / bottom inset',.52,.04,-1.68,al,root)
 cylinder(name+' / stamped lid',.563,.035,1.646,al,root);torus(name+' / rolled top lip',.57,.029,1.66,edge,root);torus(name+' / concentric score',.484,.008,1.67,al,root)
 hole=oval(name+' / drink opening',.185,.235,1.669,-.25,dark,root)
 cover=oval(name+' / scored panel',.179,.225,1.673,-.25,al,root)
 # Pivot at the rivet. The pull ring rises and the scored panel tilts into the can.
 tab=empty(name+' / pull tab pivot',root);tab.location=(0,-.02,1.708)
 vv=[];ff=[];R=72
 for z in [-.012,.012]:
  for rx,ry in [(.115,.238),(.067,.155)]:
   for i in range(R):t=math.tau*i/R;vv.append((rx*math.cos(t),.17+ry*math.sin(t),z))
 for i in range(R):
  j=(i+1)%R;ff.extend([(i,j,2*R+j,2*R+i),(R+i,3*R+i,3*R+j,R+j),(i,R+i,R+j,j),(2*R+i,2*R+j,3*R+j,3*R+i)])
 o=mesh(name+' / pierced aluminium pull ring',vv,ff,edge,tab);be=o.modifiers.new('Tab bevel','BEVEL');be.width=.009;be.segments=3
 cylinder(name+' / rivet',.042,.021,1.71,edge,root,(0,-.016))
 random.seed(26)
 for i in range(72):
  t=random.uniform(math.pi,math.tau);z=random.uniform(-1.35,1.28);r=random.uniform(.005,.016);rr=.663+r*.36
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=r,location=(rr*math.cos(t),rr*math.sin(t),z));o=bpy.context.object;o.name=name+' / bead %03d'%i;o.parent=root;o.scale=(1,1,random.uniform(.85,1.35));o.data.materials.append(water)
  for p in o.data.polygons:p.use_smooth=True
 return root,tab,hole,cover
def aim(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def light(name,loc,power,size,sy,color='FFFFFF'):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='RECTANGLE';d.size=size;d.size_y=sy;d.color=linear(color);o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;aim(o,(0,0,0));return o
w=bpy.data.worlds.new('White studio fill');s.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.82,.87,1,1);w.node_tree.nodes['Background'].inputs[1].default_value=.4
light('Key / tall silk',(-4,-4,5),650,4,7,'FFF7E8');light('Strip / right edge',(4,-1,3),900,1.2,5);light('Back rim',(0,3,5),1100,3,3);light('Front label fill',(0,-6,1),200,4,4)
cd=bpy.data.cameras.new('SUNPOP camera');cam=bpy.data.objects.new('SUNPOP camera',cd);s.collection.objects.link(cam);s.camera=cam;cd.lens=65;cd.sensor_width=36
def ease(x):x=max(0,min(1,x));return x*x*(3-2*x)
def key(o,prop,v,f):setattr(o,prop,v);o.keyframe_insert(data_path=prop,frame=f)
records=[]
if a.shot=='open':
 root,tab,hole,cover=can('Opening / original blue');s.frame_end=75;cd.lens=70
 for f in range(1,s.frame_end+1):
  t=(f-1)/30;u=ease((t-.40)/.52);v=ease(t/2.5)
  key(tab,'rotation_euler',(u*1.10,0,0),f);key(hole,'scale',(u*.98+.02,u*.98+.02,1),f);key(cover,'scale',(1-u*.97,1-u*.97,1),f)
  cam.location=(.3+.28*v,-3.5-.65*v,5.2+.30*v);aim(cam,(0,-.05,1.6));cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
  root.rotation_euler.z=math.radians(-8+16*v);root.keyframe_insert('rotation_euler',frame=f)
elif a.shot=='hero':
 root,tab,hole,cover=can('Hero / original blue');s.frame_end=180;cam.location=(0,-13.0,2.2);aim(cam,(0,0,0));cd.lens=58
 for f in range(1,s.frame_end+1):
  t=(f-1)/30;u=ease(t/1.4);v=ease((t-1.4)/4.6)
  key(root,'rotation_euler',(math.radians(3+4*v),math.radians(-68+54*u+19*v),math.radians(-28+24*u+13*v)),f)
  key(root,'location',(1.1*(1-u)+.20*math.sin(t),0,.09*math.sin(t*1.4)),f)
  key(tab,'rotation_euler',(.20,0,0),f)
else:
 cans=[can('Pack / orange','orange'),can('Pack / blue','blue'),can('Pack / cream','cream')];s.frame_end=180;cam.location=(.1,-13.8,2.7);aim(cam,(0,0,0));cd.lens=57
 for f in range(1,s.frame_end+1):
  t=(f-1)/30;u=ease(t/1.4);v=ease(t/6)
  for i,(root,tab,hole,cover) in enumerate(cans):
   x=[-1.08,0,1.10][i];y=[.38,-.55,.3][i];z=[-.08,.13,-.08][i]
   key(root,'location',(x*(.58+.42*u),y,z+.04*math.sin(t*.8+i)),f)
   key(root,'rotation_euler',(math.radians([0,3,-2][i]),math.radians([-15,3,17][i])*(.6+.4*u),math.radians([12,-3,-13][i])+math.radians(4)*v),f)
   key(tab,'rotation_euler',(.12,0,0),f)
s.frame_start=1;s.frame_set(1)
# Pack textures into the editable source for a truly self-contained .blend.
for im in bpy.data.images:
 if im.source=='FILE':im.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(P/('SUNPOP-'+a.shot+'.blend')))
dest=P/(a.shot+'-frames');dest.mkdir(exist_ok=True)
frames=a.preview if a.preview is not None else range(1,s.frame_end+1) if a.render else []
for f in frames:
 out=dest/('%04d.png'%f)
 if a.render and out.exists():continue
 s.frame_set(f);s.render.filepath=str(out);start=time.time();bpy.ops.render.render(write_still=True);records.append({'frame':f,'seconds':round(time.time()-start,2)})
(P/(a.shot+'-render.json')).write_text(json.dumps({'shot':a.shot,'engine':a.engine,'samples':a.samples,'resolution':[s.render.resolution_x*a.scale//100,s.render.resolution_y*a.scale//100],'records':records},indent=2))
