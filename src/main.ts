import './style.css'
import Phaser from 'phaser'
import { GAME_W, GAME_H, COLORS, css, computeGameW } from './game/theme'
import { BootScene } from './game/scenes/BootScene'
import { TitleScene } from './game/scenes/TitleScene'
import { WorldScene } from './game/scenes/WorldScene'
import { UIScene } from './game/scenes/UIScene'
import { CaseScene } from './game/scenes/CaseScene'
import { FinalScene } from './game/scenes/FinalScene'
import { EndScene } from './game/scenes/EndScene'
import { sfx } from './game/audio'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: css(COLORS.bg0),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H,
    // Fullscreen ολόκληρο το #app (καμβάς + DOM overlay) ώστε να ΦΑΙΝΕΤΑΙ το HTML/CSS UI σε fullscreen.
    fullscreenTarget: 'app',
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  dom: { createContainer: true },
  scene: [BootScene, TitleScene, WorldScene, UIScene, CaseScene, FinalScene, EndScene],
  render: { antialias: true, roundPixels: true },
}

const game = new Phaser.Game(config)
;(window as unknown as { __game: Phaser.Game }).__game = game

// Ξεκλείδωμα ήχου στην πρώτη χειρονομία (autoplay policy)
const unlockAudio = (): void => sfx.unlock()
window.addEventListener('pointerdown', unlockAudio)
window.addEventListener('keydown', unlockAudio)

/**
 * Responsive: το GAME_W «παγώνει» στο load για το τρέχον aspect. Όταν ο χρήστης
 * ΠΕΡΙΣΤΡΕΨΕΙ τη συσκευή (portrait↔landscape) ξαναχτίζουμε τον καμβά στο σωστό
 * aspect με reload — ΜΟΝΟ σε αλλαγή προσανατολισμού (όχι σε URL-bar show/hide),
 * και ΠΟΤΕ σε fullscreen ή όταν το storage δεν είναι διαθέσιμο (sandboxed iframe:
 * το reload θα έσβηνε την in-memory πρόοδο).
 */
function installOrientationWatcher(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return
  let storageOK = true
  try {
    localStorage.setItem('__cp_probe', '1')
    localStorage.removeItem('__cp_probe')
  } catch {
    storageOK = false
  }
  const mq = window.matchMedia('(orientation: portrait)')
  let wasPortrait = mq.matches
  const onChange = (): void => {
    const nowPortrait = window.matchMedia('(orientation: portrait)').matches
    if (nowPortrait === wasPortrait) return
    wasPortrait = nowPortrait
    if (!storageOK || game.scale.isFullscreen) return
    if (Math.abs(computeGameW() - GAME_W) < 1) return
    window.location.reload()
  }
  if (mq.addEventListener) mq.addEventListener('change', onChange)
  window.addEventListener('orientationchange', onChange)
}
installOrientationWatcher()

