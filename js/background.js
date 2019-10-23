(function() {
  class Point {
    constructor(x, y, dx, dy, r, maxDist) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
      this.maxDist = maxDist;
    }

    updatePoint(ctx) {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x - this.r <= 0 || this.x + this.r >= ctx.canvas.width) {
        this.dx = -this.dx;
      }

      if (this.y - this.r <= 0 || this.y + this.r >= ctx.canvas.height) {
        this.dy = -this.dy;
      }
    }

    drawPoint(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      ctx.fill();
    }

    drawClosestLine(ctx, points) {
      points.forEach((point) => {
        const pointDist = Math.abs(point.x - this.x) + Math.abs(point.y - this.y);
        const percentage = 1 - (pointDist/this.maxDist);

        if (pointDist <= this.maxDist) {
          ctx.lineWidth = percentage;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
    }
  }

  const canvas = document.getElementById('background');
  const ctx = canvas.getContext('2d', { alpha: false });

  const width = window.innerWidth;
  const height = window.innerHeight;

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.fillStyle = '#444444';
  ctx.fillRect(0, 0, width, height);

  const points = [];

  const initPoints = () => {
    // Determine number of points based on size of screen
    const numPoints = (width / 12) + (height / 12);
    for (let i = 0; i < numPoints; i++) {
      // Get a random size
      const size = Math.random() * 2 + 1;

      // Set the connection range based on the size of the points
      const range = (size-1/2-1) * 160 + 50
      points.push(new Point(
        Math.floor(Math.random() * (width - 10) + 5),
        Math.floor(Math.random() * (height - 10) + 5),
        Math.random() * .5 - .25,
        Math.random() * .5 - .25,
        size,
        range
      ))
    }
  }

  const updatePoints = () => {
    points.forEach((p, index) => {
      p.updatePoint(ctx);
      p.drawClosestLine(ctx, points.slice(index));
      p.drawPoint(ctx)
    });
  }

  initPoints();

  const updateCanvas = () => {
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#444444';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#34b1eb';
    ctx.strokeStyle = '#34b1eb';
    updatePoints();
    window.requestAnimationFrame(updateCanvas);
  };

  window.requestAnimationFrame(updateCanvas);
})();