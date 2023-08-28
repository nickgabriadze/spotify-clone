export function millisecondsToHhMmSs(milliseconds: number, text?:boolean): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  if(text){
    if (hours > 0) {
      return `${hh} hr ${mm} min`;
    } else {
      return `${mm} min ${ss} sec`;
    }
  }

  if (hours > 0) {
    return `${hh}:${mm}:${ss}`;
  } else {
    return `${mm}:${ss}`;
  }
}
export default millisecondsToHhMmSs