/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { VisibilityState, World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { BackdropSystem } from './backdrops.js';
import { CreatureSystem } from './creatures.js';
import { HandShapeSystem } from './hand-shapes.js';
import { PanelSystem } from './panel.js';
import { PuppetSystem } from './puppet.js';
import { RobotSystem } from './robot.js';
import { StorySystem } from './story.js';
import { StudioSystem } from './studio.js';
import { TheatreSystem } from './theatre.js';

type Game = Awaited<ReturnType<typeof World.create>>;

// The starter's welcome panel (with its Enter XR button) was removed, so the
// page needs its own button to start the VR session.
function addEnterButton(world: Game): void {
  const button = document.createElement('button');
  button.textContent = 'Enter VR';
  button.style.cssText =
    'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
    'padding:14px 32px;font:bold 20px serif;background:#f0d9a8;color:#2a1a10;' +
    'border:0;border-radius:999px;z-index:9999;cursor:pointer';

  const note = document.createElement('div');
  note.style.cssText =
    'position:fixed;bottom:86px;left:50%;transform:translateX(-50%);' +
    'max-width:80vw;text-align:center;font:16px serif;color:#f0d9a8;' +
    'z-index:9999;pointer-events:none';

  document.body.append(button, note);
  button.onclick = () => {
    void world.launchXR();
  };

  const check = navigator.xr?.isSessionSupported('immersive-vr');
  if (check === undefined) {
    button.disabled = true;
    button.textContent = 'VR not available';
    note.textContent =
      'Open this page in a Meta Quest browser, or use Chrome with the Immersive Web Emulator extension.';
  } else {
    check.then(
      (supported) => {
        if (!supported) {
          button.disabled = true;
          button.textContent = 'VR not available';
          note.textContent =
            'Open this page in a Meta Quest browser, or use Chrome with the Immersive Web Emulator extension.';
        }
      },
      () => {
        button.disabled = true;
        button.textContent = 'VR not available';
      },
    );
  }

  world.visibilityState.subscribe((state) => {
    const flat = state === VisibilityState.NonImmersive;
    button.style.display = flat ? 'block' : 'none';
    note.style.display = flat ? 'block' : 'none';
  });
}

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(RobotSystem);
  world.registerSystem(PanelSystem);
  world.registerSystem(HandShapeSystem);
  world.registerSystem(PuppetSystem);
  world.registerSystem(TheatreSystem);
  world.registerSystem(BackdropSystem);
  world.registerSystem(CreatureSystem);
  world.registerSystem(StorySystem);
  world.registerSystem(StudioSystem);
  addEnterButton(world);
});