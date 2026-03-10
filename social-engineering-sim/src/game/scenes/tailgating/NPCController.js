/**
 * NPCController.js
 *
 * Owns the NPC's physics body and visual rectangle in the Phaser scene.
 * Provides a clean API for the scene to move, stop, and animate the NPC
 * without scattering body/tween calls throughout TailgatingScene.
 *
 * Usage:
 *   this.npcCtrl = new NPCController(scene);
 *   this.npcCtrl.create(startX, startY);
 *   this.npcCtrl.approach(speed);         // walk upward
 *   this.npcCtrl.stop();
 *   this.npcCtrl.reset(x, y);             // snap back to spawn
 *   this.npcCtrl.exitTo(direction, cb);   // tween off screen
 *   this.npcCtrl.isInZone(zone)           // { x, y, w, h }
 */
export default class NPCController {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;
    this.body = null;  // Phaser ArcadeSprite (physics)
    this.viz = null;   // Rectangle drawn on top (no texture needed)
  }

  // ─── Create ──────────────────────────────────────────────────────────────────

  /**
   * Spawn the NPC at (x, y). Must be called during scene create().
   * @param {number} x
   * @param {number} y
   */
  create(x, y) {
    this.body = this.scene.physics.add
      .sprite(x, y, null)
      .setSize(22, 22);
    this.body.setImmovable(true);

    this.viz = this.scene.add.rectangle(x, y, 22, 22, 0xffb14d);

    return this;
  }

  // ─── Movement ────────────────────────────────────────────────────────────────

  /** Walk upward at the given speed (pixels/sec). */
  approach(speed = 120) {
    if (!this.body?.body) return;
    this.body.body.setVelocity(0, -speed);
  }

  /** Stop all movement immediately. */
  stop() {
    if (!this.body?.body) return;
    this.body.body.setVelocity(0, 0);
  }

  /**
   * Hard-reset the NPC to (x, y) — kills tweens, re-enables physics.
   * Use at the start of each encounter.
   */
  reset(x, y) {
    this.scene.tweens.killTweensOf(this.body);
    this.scene.tweens.killTweensOf(this.viz);

    this.body.setPosition(x, y);
    this.viz?.setPosition(x, y);

    if (this.body.body) {
      this.body.body.enable = true;
      this.body.body.reset(x, y);
      this.body.body.setVelocity(0, 0);
    }
  }

  /**
   * Animate the NPC off screen.
   * @param {"in"|"out"} direction  — "in" exits toward the top (through the door),
   *                                   "out" exits toward the bottom
   * @param {Function} [onDone]
   */
  exitTo(direction, onDone) {
    if (!this.body || !this.viz) {
      onDone?.();
      return;
    }

    this.stop();
    this.scene.tweens.killTweensOf(this.body);
    this.scene.tweens.killTweensOf(this.viz);

    if (this.body.body) {
      this.body.body.setVelocity(0, 0);
      this.body.body.enable = false;
    }

    const { width, height } = this.scene.scale;
    const targetY = direction === "in" ? -60 : height + 80;
    const drift = Phaser.Math.Between(-20, 20);
    const targetX = Phaser.Math.Clamp(this.viz.x + drift, 40, width - 40);

    this.scene.tweens.add({
      targets: this.viz,
      x: targetX,
      y: targetY,
      duration: 1200,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        this.body.setPosition(this.viz.x, this.viz.y);
        this.body.body?.reset(this.body.x, this.body.y);
      },
      onComplete: () => {
        this.body.setPosition(this.viz.x, this.viz.y);
        this.body.body?.reset(this.body.x, this.body.y);
        onDone?.();
      },
    });
  }

  // ─── Zone check ──────────────────────────────────────────────────────────────

  /**
   * @param {{ x: number, y: number, w: number, h: number }} zone
   * @returns {boolean}
   */
  isInZone(zone) {
    if (!this.body) return false;
    const { x, y } = this.body;
    return (
      x >= zone.x - zone.w / 2 &&
      x <= zone.x + zone.w / 2 &&
      y >= zone.y - zone.h / 2 &&
      y <= zone.y + zone.h / 2
    );
  }

  // ─── Sync ────────────────────────────────────────────────────────────────────

  /** Keep the viz rectangle in sync with the physics body position. */
  syncViz() {
    if (this.viz && this.body) {
      this.viz.setPosition(this.body.x, this.body.y);
    }
  }

  // ─── Position getters ────────────────────────────────────────────────────────

  get x() { return this.body?.x ?? 0; }
  get y() { return this.body?.y ?? 0; }
}