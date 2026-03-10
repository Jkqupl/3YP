/**
 * DialogueManager.js
 *
 * Manages a paginated dialogue sequence inside a Phaser scene.
 * Decoupled from encounter logic — it only knows about displaying lines of text.
 *
 * Usage:
 *   const dm = new DialogueManager(scene, txtBodyRef, txtFeedbackRef);
 *   dm.show(["Line one", "Line two", "Line three", "Line four"]);
 *   dm.isActive()   // true while pages remain
 *   dm.advance()    // page forward; returns true when finished
 *   dm.clear()      // cancel and reset
 */
export default class DialogueManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Text} txtBody     — text object for dialogue lines
   * @param {Phaser.GameObjects.Text} txtFeedback — text object for hint messages
   * @param {object} [opts]
   * @param {number} [opts.pageSize=3]            — lines shown per page
   * @param {number} [opts.autoDelayMs=2550]      — ms before auto-advancing a page
   * @param {number} [opts.minReadMs=150]          — minimum ms before click/enter works
   */
  constructor(scene, txtBody, txtFeedback, opts = {}) {
    this.scene = scene;
    this.txtBody = txtBody;
    this.txtFeedback = txtFeedback;

    this.pageSize = opts.pageSize ?? 3;
    this.autoDelayMs = opts.autoDelayMs ?? 2550;
    this.minReadMs = opts.minReadMs ?? 150;

    this._queue = [];
    this._index = 0;
    this._active = false;
    this._timer = null;

    /** Called once when the last page has been shown. */
    this.onComplete = null;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Begin displaying a dialogue. Single strings are shown immediately without
   * paging. Arrays below pageSize are shown in one shot.
   *
   * @param {string | string[]} lines
   * @param {Function} [onComplete] — optional callback when the last page shows
   */
  show(lines, onComplete = null) {
    this.clear();
    this.onComplete = onComplete;

    if (!Array.isArray(lines)) {
      this.txtBody.setText(lines);
      this._active = false;
      if (onComplete) onComplete();
      return;
    }

    this._queue = lines;
    this._index = 0;

    // Short enough to fit on one page — no paging needed
    if (lines.length <= this.pageSize) {
      this.txtBody.setText(lines.join("\n"));
      this._active = false;
      if (onComplete) onComplete();
      return;
    }

    this._active = true;
    this._renderPage();
  }

  /** Returns true while there are more pages to display. */
  isActive() {
    return this._active;
  }

  /**
   * Advance to the next page.
   * @returns {boolean} true if this was the final page
   */
  advance() {
    if (!this._active) return true;

    this._index += this.pageSize;

    if (this._index >= this._queue.length) {
      this._active = false;
      this._clearTimer();
      if (this.onComplete) this.onComplete();
      return true;
    }

    this._renderPage();
    return false;
  }

  /** Cancel any active dialogue and reset state. */
  clear() {
    this._clearTimer();
    this._queue = [];
    this._index = 0;
    this._active = false;
    this.onComplete = null;
  }

  /** How long (ms) the user must wait before their input registers. */
  get minReadDeadline() {
    return this._pageShownAt + this.minReadMs;
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _renderPage() {
    this._clearTimer();

    const page = this._queue
      .slice(this._index, this._index + this.pageSize)
      .join("\n");

    this.txtBody.setText(page);
    this.txtFeedback.setText("Click or Enter to skip");
    this._pageShownAt = Date.now();

    // Schedule auto-advance
    this._timer = this.scene.time.addEvent({
      delay: this.autoDelayMs,
      callback: () => {
        if (this._active) this.advance();
      },
    });
  }

  _clearTimer() {
    if (this._timer) {
      this._timer.remove(false);
      this._timer = null;
    }
  }
}