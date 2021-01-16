import * as tf from '@tensorflow/tfjs';

//recognize gesture off of landmarks
import * as fp from 'fingerpose'
import {one, two, three, four, five} from "./CustomGestures";

const labels = [
    'M', 'L', 'H'
];

const GE = new fp.GestureEstimator([
    one, two, three, four, five
]);

//draw green boundary around the hand
export const displayHand = (image, classification, marks, ctx) => {
    let w = image.width;
    let h = image.height;
    //let score = classification.score;

    //console.log(marks);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'rgba(171, 235, 52, 1)';

    let marks_ = new Array(21);
    for(let i = 0; i < 21; i++){
        marks_[i] = [marks[i].x * w, marks[i].y * h, 0];
    }

    //console.log(marks_);

    const manual_gesture = GE.estimate(
        marks_, 7.5 //7.5 is minimum confidence out of 10
    );

    //console.log(manual_gesture);

    if (manual_gesture.gestures !== undefined 
        && manual_gesture.gestures.length > 0) {

        //console.log(manual_gesture.gestures);
        const confidence = manual_gesture.gestures.map(
          (prediction) => prediction.confidence
        );
        const maxConfidence = confidence.indexOf(
          Math.max.apply(null, confidence)
        );
        console.log(manual_gesture.gestures[maxConfidence].name, 'is the best numeric guess from 1 to 5');
      }

    if (marks.length > 0){
        let x1 = 1, x2 = 0, y1 = 1, y2 = 0;
        marks.forEach(m => {
            if (m.x < x1) x1 = m.x;
            if (m.x > x2) x2 = m.x;
            if (m.y < y1) y1 = m.y;
            if (m.y > y2) y2 = m.y;
        });

        x1 *= w;
        x2 *= w;
        y1 *= h;
        y2 *= h;

        let x_mid = (x1 + x2) / 2;
        let y_mid = (y1 + y2) / 2;
        const factors = [0.5, 0.9, 1.2]

        let guesses = new Array(factors.length);
        let confidence = new Array(factors.length);

        let nGuess = 0;
        factors.forEach( scale_fac => {
            let w_ = Math.max((x2 - x1) * scale_fac, (y2 - y1) * scale_fac);
            //crop bound
            let x_min = Math.max(0, x_mid - w_),
                y_min = Math.max(0, y_mid - w_);  
            //get image from video
            //64x64 rgba image on the left top corner of the canvas
            ctx.drawImage(window.webcamEl, x_min, y_min, 2 * w_, 2 * w_, 0, 0, 64, 64);
            
            let img_temp = ctx.getImageData(0, 0, 64, 64);

            let pix = new Float32Array(64 * 64 * 3);
            let cur = 0;
            for(let i = 0; i < 64 * 64 * 4; i++){
                if (i%4 !== 3){
                    if (i%4 === 2)
                        pix[cur - 2] = img_temp.data[i] / 255.0;
                    if (i%4 === 1)
                        pix[cur] = img_temp.data[i] / 255.0
                    if (i%4 === 0)
                        pix[cur + 2] = img_temp.data[i] / 255.0;
                    //pix[cur] = img_temp.data[i] / 255.0;
                    cur += 1;
                }
            }

            //console.log(pix);
            
            let tensor = tf.tensor4d(pix, [1, 64, 64, 3], 'float32');
            //console.log(tensor.dataSync());
            let recognized = window.recognizer.predict(tensor).bufferSync().values;
            
            //console.log(recognized);

            let max = 0;
            let charindex = -1;
            for (let i = 0; i < recognized.length; i++){
                if (recognized[i] > max){
                    max = recognized[i];
                    charindex = i;
                }
            }

            confidence[nGuess] = max;
            guesses[nGuess] = charindex;

            nGuess += 1;
        });

        let best_confidence = confidence[0];
        let best_guess = guesses[0];
        for (let j = 1; j < nGuess; j++){
            if(best_confidence < confidence[j]){
                best_confidence = confidence[j];
                best_guess = guesses[j];
            }
        }

        console.log(labels[best_guess], "is the best letter guess out of 'MLH' with confidence:", best_confidence);
        
        //console.log(labels[charindex], recognized[charindex]);

        //console.log(img_temp);

        //ctx.scale(64 / img_temp.width, 64 / img_temp.height);
        //ctx.putImageData(img_temp, 0, 0);

        ctx.lineWidth = 5;
        ctx.strokeRect(
            x1, y1,
            x2 - x1, y2 - y1
            );
    }
}

//draw red boundary around the entire screen when no hand is discovered
export const displayEmpty = (ctx) => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}