// Orthographic projection of an equirectangular Earth texture, with directional daylight.
const Earth = (() => {
  const texture = new Image();
  texture.src = '/assets/earth.webp';
  let pixels;
  let animation;
  let generation = 0;
  async function start(canvas, flying) {
    const token = ++generation;
    cancelAnimationFrame(animation);
    if (!canvas) return;
    try {
      await texture.decode();
      if (!pixels) {
        const buffer = document.createElement('canvas');
        buffer.width = texture.width;
        buffer.height = texture.height;
        const ctx = buffer.getContext('2d', {willReadFrequently:true});
        ctx.drawImage(texture, 0, 0);
        pixels = ctx.getImageData(0, 0, buffer.width, buffer.height).data;
      }
    } catch { return; }
    if (token !== generation || !canvas.isConnected) return;
    const ctx = canvas.getContext('2d');
    const size = 400;
    canvas.width = canvas.height = size;
    const frame = ctx.createImageData(size,size);
    const points = [];
    const tilt = 9.03 * Math.PI / 180;
    for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
      const east = (2*x+1)/size-1;
      const up = 1-(2*y+1)/size;
      const radius = east*east+up*up;
      if (radius>=1) continue;
      const depth = Math.sqrt(1-radius);
      const latitude = Math.asin(up*Math.cos(tilt)+depth*Math.sin(tilt));
      const longitude = Math.atan2(east,depth*Math.cos(tilt)-up*Math.sin(tilt));
      const row = Math.floor((.5-latitude/Math.PI)*texture.height)*texture.width;
      const column = (.5+longitude/(2*Math.PI))*texture.width;
      const shade = .38+.69*Math.max(0,depth*.82-east*.48+up*.28);
      points.push([4*(y*size+x),row,column,shade,(1-depth)**4]);
    }
    const startTime = performance.now();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previous = -100;
    function draw(now) {
      if (token !== generation || !canvas.isConnected) return;
      if (now-previous>=55) {
        previous=now;
        const elapsed = (now-startTime)/1000;
        const t = Math.min(1,elapsed/2);
        const longitude = flying ? 38.75-67*(1-t*t*(3-2*t)) : 25+(reduced?0:elapsed*4);
        const offset=longitude/360*texture.width;
        for (const [i,row,col,light,rim] of points) {
          const at=4*(row+Math.floor(col+offset+texture.width)%texture.width);
          frame.data[i]=pixels[at]*light+rim*38;
          frame.data[i+1]=pixels[at+1]*light+rim*80;
          frame.data[i+2]=pixels[at+2]*light+rim*100;
          frame.data[i+3]=255;
        }
        ctx.putImageData(frame,0,0);
      }
      if (!reduced) animation=requestAnimationFrame(draw);
    }
    draw(performance.now());
  }
  return {start};
})();
