var Point = function(x, y) {
    this.x = x;
    this.y = y;
  };
  
  Point.prototype.scalarMultiply = function(B) {
    let newX = this.x * B;
    let newY = this.y * B;
    return new Point(newX, newY);
  };
  
  Point.prototype.add = function(B) {
    let newX = this.x + B.x;
    let newY = this.y + B.y;
    return new Point(newX, newY);
  };
  
  var Segment = function(args = {}) {
    const { A, B } = args;
    this.A = new Point(A[0], A[1]);
    this.B = new Point(B[0], B[1]);
  };
  
  Segment.prototype.split = function() {
    let U = new Point(this.B.x - this.A.x, this.B.y - this.A.y);
    let V = new Point(this.A.y - this.B.y, this.B.x - this.A.x);
    let P = this.A.add(U.scalarMultiply(1 / 3));
    let Q = this.A.add(
      U.scalarMultiply(1 / 2).add(V.scalarMultiply(Math.sqrt(3) / 6))
    );
    let R = this.A.add(U.scalarMultiply(2 / 3));
  
    return [
      new Segment({
        A: [this.A.x, this.A.y],
        B: [P.x, P.y]
      }), //A-P
      new Segment({
        A: [P.x, P.y],
        B: [Q.x, Q.y]
      }), //P-Q
      new Segment({
        A: [Q.x, Q.y],
        B: [R.x, R.y]
      }), //Q-R
      new Segment({
        A: [R.x, R.y],
        B: [this.B.x, this.B.y]
      }) //R-B
    ];
  };
  
  Segment.prototype.canvasY = Y => 500 - Y;
  Segment.prototype.canvasY = X => 500 - X;
  
  Segment.prototype.getLength = function() {
    let xDiff = this.B.x - this.A.x;
    let yDiff = this.B.y - this.A.y;
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  };
  
  Segment.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "#1ac7c9";
    ctx.lineWidth = 5;
    ctx.moveTo(this.A.x, this.canvasY(this.A.y));
    ctx.lineTo(this.B.x, this.canvasY(this.B.y));
    
    ctx.stroke();
  };

 
  
  window.onload = function() {
    const canvas = document.getElementById("koch");
    const ctx = canvas.getContext("2d");
    const triWidth = 400; //px
    const padding = 10; //px
    canvas.width = triWidth + padding * 4;
    canvas.height = triWidth + padding * 26;
    const triangleHeight = Math.sqrt(3) * triWidth / 2;
  
    const getPerimeter = segments =>
      segments.reduce((acc, b) => (acc += b.getLength()), 0);
  
    const startingLine = [
      new Segment({ A: [0, 0], B: [triWidth / 2, triangleHeight] }),
      new Segment({ A: [triWidth / 2, triangleHeight], B: [triWidth, 0] }),
      new Segment({ A: [triWidth, 0], B: [0, 0] })
    ];
  
    const maxIter = 2;
    let interval = startingLine;
    //a backface canvas for initial saving off of sequence to a CanvasData array
    const back = document.createElement("canvas");
    document.body.appendChild(back);
    back.style.display = "none";
    back.style.color="red";
    back.width = canvas.width;
    back.height = canvas.height;
    let backCtx = back.getContext("2d");
    backCtx.imageSmoothingEnabled = true;
    // backCtx.translate(padding, padding);
    // ctx.translate(padding, padding);
    ctx.imageSmoothingEnabled = true;
    let pics = [];
  
    startingLine.forEach(seg => seg.draw(ctx));
     startingLine.forEach(seg => seg.draw(backCtx));
  
    // pics.push(backCtx.getImageData(0, 0, canvas.width, canvas.height));
  
    for (var i = 0; i < maxIter; i++) {
      interval = interval
        .map(e => e.split())
        .reduce((acc, b) => acc.concat(b), []);
      (function(i, interval) {
        setTimeout(() => {
         interval.forEach(t => t.draw(backCtx));
          pics.push(backCtx.getImageData(0, 0, canvas.width, canvas.height));
           backCtx.clearRect(0, 0, canvas.width, canvas.height);
        }, 500 * i);
      })(i, interval.slice());
    }
  
    setTimeout(() => {
      //play the snowflake sequence backwards and forwards as pictures
      var ct = 0;
      var direction = 1;
      back.style.display = "none";
      canvas.style.display = "flex";
      canvas.style.paddingLeft="3%";
     
      setInterval(() => {
        if (ct == pics.length - 1) {
          direction = -1;
        }
        if (ct === 0) {
          direction = 1;
        }
        ct += direction;
        let randR=Math.floor((Math.random() * 100) + 1)
      let randG= Math.floor((Math.random() * 100) + 1)
      let randB= Math.floor((Math.random() * 100) + 1)
      let opacity= Math.random(0.2,1)
      canvas.style.background='rgba('+randR+','+randG+','+ randB+')';
      console.log(ctx.strokeStyle);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.putImageData(pics[ct], 0, 0);
       
      }, 400);
    }, 3000);
  };