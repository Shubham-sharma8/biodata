// Interactive HTML5 Canvas Photo Cropper (Drag, Zoom, Rotate, Aspect Ratio)
// Runs 100% client-side with zero external dependencies or uploads.

export class PhotoCropperModal {
  constructor(onConfirm) {
    this.onConfirm = onConfirm;
    this.image = null;
    this.scale = 1;
    this.rotation = 0; // degrees
    this.offsetX = 0;
    this.offsetY = 0;
    this.aspectRatio = 4 / 5; // default portrait 4:5 (or 1:1 square)
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.modalEl = null;
    this.canvas = null;
    this.ctx = null;
    this.initDOM();
  }

  initDOM() {
    const existing = document.getElementById('photo-cropper-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'photo-cropper-modal';
    modal.className = 'cropper-modal-backdrop hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Crop and Adjust Profile Photo');
    modal.innerHTML = `
      <div class="cropper-modal-card">
        <div class="cropper-modal-header">
          <div>
            <h3 class="cropper-modal-title">Adjust &amp; Crop Portrait Photo</h3>
            <p class="cropper-modal-subtitle">Drag to reposition, scroll or slide to zoom, and rotate as needed.</p>
          </div>
          <button type="button" class="btn-icon" id="cropper-close-btn" aria-label="Close cropper">&times;</button>
        </div>

        <div class="cropper-stage-wrapper">
          <canvas id="cropper-canvas" width="440" height="550"></canvas>
          <div class="cropper-grid-overlay" id="cropper-grid-overlay"></div>
        </div>

        <div class="cropper-controls">
          <div class="cropper-control-row">
            <label for="cropper-zoom">Zoom <span id="cropper-zoom-val">100%</span></label>
            <input type="range" id="cropper-zoom" min="0.5" max="3.2" step="0.02" value="1" />
          </div>

          <div class="cropper-control-row">
            <label for="cropper-rotate">Straighten / Rotate <span id="cropper-rotate-val">0&deg;</span></label>
            <div class="cropper-rotate-group">
              <button type="button" class="btn-chip" id="cropper-rot-left" title="Rotate -90°">&#8634; -90&deg;</button>
              <input type="range" id="cropper-rotate" min="-180" max="180" step="1" value="0" />
              <button type="button" class="btn-chip" id="cropper-rot-right" title="Rotate +90°">&#8635; +90&deg;</button>
            </div>
          </div>

          <div class="cropper-control-row cropper-aspect-row">
            <span>Aspect Ratio:</span>
            <div class="cropper-aspect-btns">
              <button type="button" class="btn-chip active" data-aspect="0.8">4:5 Portrait</button>
              <button type="button" class="btn-chip" data-aspect="1">1:1 Square</button>
              <button type="button" class="btn-chip" data-aspect="0.75">3:4 Classic</button>
              <button type="button" class="btn-chip" id="cropper-reset-btn">Reset</button>
            </div>
          </div>
        </div>

        <div class="cropper-modal-footer">
          <button type="button" class="btn-secondary" id="cropper-cancel-btn">Cancel</button>
          <button type="button" class="btn-primary" id="cropper-apply-btn">Apply Photo to Biodata</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalEl = modal;
    this.canvas = modal.querySelector('#cropper-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.bindEvents();
  }

  bindEvents() {
    const zoomInput = this.modalEl.querySelector('#cropper-zoom');
    const zoomVal = this.modalEl.querySelector('#cropper-zoom-val');
    const rotateInput = this.modalEl.querySelector('#cropper-rotate');
    const rotateVal = this.modalEl.querySelector('#cropper-rotate-val');

    zoomInput.addEventListener('input', (e) => {
      this.scale = parseFloat(e.target.value);
      zoomVal.textContent = `${Math.round(this.scale * 100)}%`;
      this.render();
    });

    rotateInput.addEventListener('input', (e) => {
      this.rotation = parseInt(e.target.value, 10);
      rotateVal.textContent = `${this.rotation}°`;
      this.render();
    });

    this.modalEl.querySelector('#cropper-rot-left').addEventListener('click', () => {
      this.rotation = ((this.rotation - 90 + 180) % 360) - 180;
      rotateInput.value = String(this.rotation);
      rotateVal.textContent = `${this.rotation}°`;
      this.render();
    });

    this.modalEl.querySelector('#cropper-rot-right').addEventListener('click', () => {
      this.rotation = ((this.rotation + 90 + 180) % 360) - 180;
      rotateInput.value = String(this.rotation);
      rotateVal.textContent = `${this.rotation}°`;
      this.render();
    });

    this.modalEl.querySelector('#cropper-reset-btn').addEventListener('click', () => {
      this.resetTransform();
      this.render();
    });

    this.modalEl.querySelectorAll('[data-aspect]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.modalEl.querySelectorAll('[data-aspect]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.aspectRatio = parseFloat(btn.getAttribute('data-aspect'));
        this.updateCanvasDimensions();
        this.resetTransform();
        this.render();
      });
    });

    // Pointer drag events
    const startDrag = (clientX, clientY) => {
      this.isDragging = true;
      this.dragStartX = clientX - this.offsetX;
      this.dragStartY = clientY - this.offsetY;
    };

    const moveDrag = (clientX, clientY) => {
      if (!this.isDragging) return;
      this.offsetX = clientX - this.dragStartX;
      this.offsetY = clientY - this.dragStartY;
      this.render();
    };

    const endDrag = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', endDrag);

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.06 : -0.06;
      this.scale = Math.min(3.2, Math.max(0.5, this.scale + delta));
      zoomInput.value = String(this.scale);
      zoomVal.textContent = `${Math.round(this.scale * 100)}%`;
      this.render();
    }, { passive: false });

    this.modalEl.querySelector('#cropper-close-btn').addEventListener('click', () => this.close());
    this.modalEl.querySelector('#cropper-cancel-btn').addEventListener('click', () => this.close());
    this.modalEl.querySelector('#cropper-apply-btn').addEventListener('click', () => {
      const dataUrl = this.canvas.toDataURL('image/jpeg', 0.94);
      if (this.onConfirm) {
        this.onConfirm(dataUrl);
      }
      this.close();
    });
  }

  updateCanvasDimensions() {
    const baseWidth = 480;
    const baseHeight = Math.round(baseWidth / this.aspectRatio);
    this.canvas.width = baseWidth;
    this.canvas.height = baseHeight;
  }

  resetTransform() {
    if (!this.image) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const fitScale = Math.max(cw / this.image.width, ch / this.image.height);
    this.baseFitScale = fitScale;
    this.scale = 1;
    this.rotation = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    const zoomInput = this.modalEl.querySelector('#cropper-zoom');
    const zoomVal = this.modalEl.querySelector('#cropper-zoom-val');
    const rotateInput = this.modalEl.querySelector('#cropper-rotate');
    const rotateVal = this.modalEl.querySelector('#cropper-rotate-val');
    if (zoomInput) zoomInput.value = '1';
    if (zoomVal) zoomVal.textContent = '100%';
    if (rotateInput) rotateInput.value = '0';
    if (rotateVal) rotateVal.textContent = '0°';
  }

  openWithFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.openWithDataUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  openWithDataUrl(dataUrl) {
    const img = new Image();
    img.onload = () => {
      this.image = img;
      this.updateCanvasDimensions();
      this.resetTransform();
      this.modalEl.classList.remove('hidden');
      this.render();
    };
    img.src = dataUrl;
  }

  close() {
    this.modalEl.classList.add('hidden');
  }

  render() {
    if (!this.image || !this.ctx) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.ctx.clearRect(0, 0, cw, ch);

    // Subtle studio neutral background in case user zooms out
    this.ctx.fillStyle = '#F8FAFC';
    this.ctx.fillRect(0, 0, cw, ch);

    this.ctx.save();
    this.ctx.translate(cw / 2 + this.offsetX, ch / 2 + this.offsetY);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    const totalScale = (this.baseFitScale || 1) * this.scale;
    this.ctx.scale(totalScale, totalScale);
    this.ctx.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2,
      this.image.width,
      this.image.height
    );
    this.ctx.restore();
  }
}
