/*
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export function installPointerEvent() {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.PointerEvent = class FakePointerEvent extends MouseEvent {
      _init: {
        pageX: number;
        pageY: number;
        pointerType: string;
        pointerId: number;
        width: number;
        height: number;
      };
      constructor(name: any, init: any) {
        super(name, init);
        this._init = init;
      }
      get pointerType() {
        return this._init.pointerType;
      }
      get pointerId() {
        return this._init.pointerId;
      }
      get pageX() {
        return this._init.pageX;
      }
      get pageY() {
        return this._init.pageY;
      }
      get width() {
        return this._init.width;
      }
      get height() {
        return this._init.height;
      }
    };
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.PointerEvent;
  });
}
