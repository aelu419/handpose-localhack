import * as tf from '@tensorflow/tfjs';

const labels = [
    'A','B','C','D','E','F','G','H','I',
    'J','K','L','M','N','O','P','Q','R',
    'S','T','U','V','W','X','Y','Z',
    'space','del','nothing'
];

//draw green boundary around the hand
export const displayHand = (image, classification, marks, ctx) => {
    let w = image.width;
    let h = image.height;
    let score = classification.score;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'rgba(171, 235, 52, 1)';

    //console.log(window.webcamEl);

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
        let w_ = Math.max((x2 - x1) * .85, (y2 - y1) * .85);
        //crop bound
        let x_min = Math.max(0, x_mid - w_),
            y_min = Math.max(0, y_mid - w_);  
        //get image from video
        //64x64 rgba image on the left top corner of the canvas
        ctx.drawImage(window.webcamEl, x_min, y_min, 2 * w_, 2 * w_, 0, 0, 64, 64);
        
        let img_temp = ctx.getImageData(0, 0, 64, 64);
        let gray = new Float32Array(img_temp.width * img_temp.height);
        for(let cursor = 0; cursor < gray.length; cursor++){
            //rgb to single channel gray
            gray[cursor] = (
                0.21 * [img_temp.data[4 * cursor]] 
                + 0.72 * [img_temp.data[4 * cursor + 1]] 
                + 0.07 * [img_temp.data[4 * cursor + 2]]
            ) / 255.0;
        }

        let tensor = tf.tensor3d(gray, [1, 64, 64], 'float32');
        let recognized = window.recognizer.predict([tensor]).bufferSync().values;
        
        let max = 0;
        let charindex = -1;
        for (let i = 0; i < recognized.length; i++){
            if (recognized[i] > max){
                max = recognized[i];
                charindex = i;
            }
        }

        console.log(labels[charindex], recognized[charindex]);

        //console.log(img_temp);

        //ctx.scale(64 / img_temp.width, 64 / img_temp.height);
        //ctx.putImageData(img_temp, 0, 0);

        ctx.lineWidth = 5;
        ctx.strokeRect(x_min, y_min, 2 * w_, 2 * w_);
    }
}

//draw red boundary around the entire screen when no hand is discovered
export const displayEmpty = (ctx) => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}