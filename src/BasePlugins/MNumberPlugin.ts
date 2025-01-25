import { CanNotAnimateErr, MineHandlerConfig, Result } from "../Interfaces";
import { MineHandler } from "../MineHandler";
import { MinePlugin } from "../MinePlugin";

export class MNumberPlugin extends MinePlugin<number> {
  handle(config: MineHandlerConfig<any>)
    :Result<MineHandler<number>, CanNotAnimateErr> 
  {
    if(typeof (config.start) !== 'number'){
      return CanNotAnimateErr;
    }
    return new MNumberHandler(config);
  }
}

export class MNumberHandler extends MineHandler<number> {
  constructor(config: MineHandlerConfig<number>){
    super(config);
  }
  seek(time: number){
    this.setter(
      this.start 
      + (this.end - this.start) * this.ease(time / this.duration)
    );
  }
}