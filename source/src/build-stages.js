// Caption follows the actual scrubbed animation, not the ahead-of-camera scroll position.
export const stageStarts=[0,.1,1.1,2.1,4.1,5.1,6.1,7.1,8.75,9.65,10.65,11.65,12.65,13.65];
export function stageAtTime(time){let stage=0;for(let i=1;i<stageStarts.length;i++)if(time>=stageStarts[i])stage=i;return stage;}
