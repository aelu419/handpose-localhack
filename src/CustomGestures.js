// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

export const one = new GestureDescription('1');
export const two = new GestureDescription('2');
export const three = new GestureDescription('3');
export const four = new GestureDescription('4');
export const five = new GestureDescription('5');

one.addCurl(0, FingerCurl.HalfCurl, 1.0);
one.addCurl(1, FingerCurl.NoCurl, 1.0);
one.addCurl(2, FingerCurl.FullCurl, 1.0);
one.addCurl(3, FingerCurl.FullCurl, 1.0);
one.addCurl(4, FingerCurl.FullCurl, 1.0);

two.addCurl(0, FingerCurl.HalfCurl, 1.0);
two.addCurl(1, FingerCurl.NoCurl, 1.0);
two.addCurl(2, FingerCurl.NoCurl, 1.0);
two.addCurl(3, FingerCurl.FullCurl, 1.0);
two.addCurl(4, FingerCurl.FullCurl, 1.0);

two.addCurl(1, FingerCurl.FullCurl, -1.0);

two.addDirection(1, 0, 1.0);
two.addDirection(2, 0, 1.0);

three.addCurl(0, FingerCurl.HalfCurl, 1.0);
three.addCurl(1, FingerCurl.FullCurl, 1.0);
three.addCurl(2, FingerCurl.NoCurl, 1.0);
three.addCurl(3, FingerCurl.NoCurl, 1.0);
three.addCurl(4, FingerCurl.NoCurl, 1.0);

three.addCurl(2, FingerCurl.FullCurl, -1.0);

four.addCurl(0, FingerCurl.HalfCurl, 1.0);
four.addCurl(1, FingerCurl.NoCurl, 1.0);
four.addCurl(2, FingerCurl.NoCurl, 1.0);
four.addCurl(3, FingerCurl.NoCurl, 1.0);
four.addCurl(4, FingerCurl.NoCurl, 1.0);

four.addCurl(3, FingerCurl.FullCurl, -1.0);

five.addCurl(0, FingerCurl.NoCurl, 1.0);
five.addCurl(1, FingerCurl.NoCurl, 1.0);
five.addCurl(2, FingerCurl.NoCurl, 1.0);
five.addCurl(3, FingerCurl.NoCurl, 1.0);
five.addCurl(4, FingerCurl.NoCurl, 1.0);

five.addCurl(4, FingerCurl.FullCurl, -1.0);
