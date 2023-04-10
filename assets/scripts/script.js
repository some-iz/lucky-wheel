const sectors = [
  {color:"#8E44AD", label:"پوچ"},
  {color:"#D35400", label:"تست ۱"},
  {color:"#A09AA3", label:"تست ۲"},
  {color:"#C0392B", label:"تست ۳"},
  {color:"#3C4F9C", label:"تست ۴"},
  {color:"#2989B9", label:"تست ۵"},
];

// Generate random float in range min-max:
const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext`2d`;
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / tot;
const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
const angVelMin = 0.002; // Below that number will be treated as a stop
let angVelMax = 0; // Random ang.vel. to accelerate to 
let angVel = 0;    // Current angular velocity
let ang = 0;       // Angle rotation in radians
let isSpinning = false;
let isAccelerating = false;
let animFrame = null; // Engine's requestAnimationFrame

//* Get index of current sector */
const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

//* Draw sectors and prizes texts to canvas */
const drawSector = (sector, i) => {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px 'IRANSans'";
  ctx.fillText(sector.label, rad - 20, 10);
  //
  ctx.restore();
};

//* CSS rotate CANVAS Element */
const rotate = () => {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  elSpin.textContent = !angVel ? "بچرخون" : sector.label;
  elSpin.style.background = sector.color;
};

const frame = () => {

  if (!isSpinning) return;

  if (angVel >= angVelMax) isAccelerating = false;

  // Accelerate
  if (isAccelerating) {
    angVel ||= angVelMin; // Initial velocity kick
    angVel *= 1.06; // Accelerate
  }
  
  // Decelerate
  else {
    isAccelerating = false;
    angVel *= friction; // Decelerate by friction  

    // SPIN END:
    if (angVel < angVelMin) {
      isSpinning = false;
      angVel = 0;
      cancelAnimationFrame(animFrame);

      
      const sector = sectors[getIndex()];
      showAlert(sector.label)
    }
  }

  ang += angVel; // Update angle
  ang %= TAU;    // Normalize angle
  rotate();      // CSS rotate!
};

const engine = () => {
  frame();
  animFrame = requestAnimationFrame(engine);
};

elSpin.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  isAccelerating = true;
  angVelMax = rand(0.25, 0.40);
  engine(); // Start engine!
});

// INIT!
sectors.forEach(drawSector);
rotate(); // Initial rotation


const showAlert = (prize) => {
  document.getElementById('alert-box').classList.remove('d-none');

  let alert = 
    `<div class="show-alert p-4 text-center mx-2">
      <h4 class="mb-4">
          شما برنده جایزه زیر شدید :  
      </h4>
      <p class="mb-0">
          ${prize}
      </p>
    </div>`;
  document.getElementById('show-alert').innerHTML = alert;
};

document.getElementById('close-alert').addEventListener("click", () => {
  document.getElementById('alert-box').classList.add('d-none');
});