import numpy as np
from collections import deque
from PIL import Image, ImageFilter
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'img', 'logo') + os.sep
orig=Image.open(R+'ser-capoeira-original.png').convert('RGB')
W,H=orig.size; K=2
big=orig.resize((W*K,H*K),Image.LANCZOS)
a=np.asarray(big).astype(int)
mx,mn=a.max(2),a.min(2)
cand=(mn>232)&((mx-mn)<18)
h,w=cand.shape
bg=np.zeros_like(cand); q=deque()
for x in range(w):
    for y in (0,h-1):
        if cand[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
for y in range(h):
    for x in (0,w-1):
        if cand[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
while q:
    y,x=q.popleft()
    for ny,nx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
        if 0<=ny<h and 0<=nx<w and cand[ny,nx] and not bg[ny,nx]:
            bg[ny,nx]=True; q.append((ny,nx))
rgba=big.copy(); rgba.putalpha(Image.fromarray(np.where(bg,0,255).astype(np.uint8)))
# reduz para 1x: a borda fica suave por supersampling (sem blur)
small=rgba.resize((W,H),Image.LANCZOS)
bb=small.getbbox(); small=small.crop(bb)
pad=8; m=Image.new('RGBA',(small.width+2*pad,small.height+2*pad),(0,0,0,0)); m.paste(small,(pad,pad))
m.save(R+'ser-capoeira.png'); print('mestre',m.size)

# ---- versão clara (texto branco só na região das palavras; halos externos removidos) ----
src=np.array(m).astype(int); h,w=src.shape[:2]
r,g,b,al=[src[...,i] for i in range(4)]
mx=np.maximum(np.maximum(r,g),b); mn=np.minimum(np.minimum(r,g),b)
neutro=(mx-mn)<38
yy,xx=np.mgrid[0:h,0:w]
reg=((xx>=405)&(yy>=245)&(yy<312))|((xx>=285)&(yy>=305)&(yy<395))
def filt(mk,f,k): return np.array(Image.fromarray(mk.astype(np.uint8)).filter(f(k)))
perto_borda=filt((al<128).astype(np.uint8)*255,ImageFilter.MaxFilter,7)>0
halo=(mn>170)&perto_borda&~reg
out=src.copy()
for i,c in enumerate((r,g,b)): out[...,i]=np.where(reg&neutro,255,c)
out[...,3]=np.where(halo,0,al)
# miolo branco preso dentro de letras (componentes grandes de branco puro fora do texto)
branco=(mn>235)&((mx-mn)<20)&(out[...,3]>200)&~reg
vis=np.zeros_like(branco)
for y in range(h):
  for x in range(w):
    if branco[y,x] and not vis[y,x]:
      comp=[];qq=deque([(y,x)]);vis[y,x]=True
      while qq:
        cy,cx=qq.popleft();comp.append((cy,cx))
        for ny,nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
          if 0<=ny<h and 0<=nx<w and branco[ny,nx] and not vis[ny,nx]: vis[ny,nx]=True;qq.append((ny,nx))
      if len(comp)>60:
        ys,xs=zip(*comp); out[ys,xs,3]=0
Image.fromarray(out.astype(np.uint8)).save(R+'ser-capoeira-clara.png'); print('clara ok')
