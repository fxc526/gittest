/**
 * Created by fxc52 on 2017/12/4.
 */
/*!
 ** by zhangxinxu(.com)
 ** ???HTML5 video¨¨¡ì?¨¦?¡®????????¡è??¡¯???????????????
 ** http://www.zhangxinxu.com/wordpress/?p=6386
 ** MIT License
 ** ???????¡ë?????¡±????
 */
var CanvasBarrage = function (canvas, video, options) {
    if (!canvas || !video) {
        return;
    }
    var defaults = {
        opacity: 100,
        fontSize: 24,
        speed: 2,
        range: [0,1],
        color: 'white',
        data: []
    };

    options = options || {};

    var params = {};
    // ?????¡ã??????
    for (var key in defaults) {
        if (options[key]) {
            params[key] = options[key];
        } else {
            params[key] = defaults[key];
        }

        this[key] = params[key];
    }
    var top = this;
    var data = top.data;

    if (!data || !data.length) {
        return;
    }

    var context = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // ?????¡§??????
    var store = {};

    // ????????????
    var isPause = true;
    // ?¡¯??¡±??¡ª?¨¦??
    var time = video.currentTime;

    // ??¡ª??¡¤?¡è¡ì?¡ã?
    var fontSize = 28;

    // ???????¨C????
    var Barrage = function (obj) {
        // ??¢ã??????¨¦???????¡ã
        this.value = obj.value;
        this.time = obj.time;
        // data????????????¨¨????¨C?¡­¡§?¡À¢ã???¨¨?????
        this.init = function () {
            // 1.txt. ¨¦¢ã????
            var speed = top.speed;
            if (obj.hasOwnProperty('speed')) {
                speed = obj.speed;
            }
            if (speed !== 0) {
                // ¨¦????¢ã??¡ª??¡ã?????????¨¦¢ã?????????¡ë???¨¨¡ã?
                speed = speed + obj.value.length / 100;
            }
            // 2. ??¡ª??¡¤?¡è¡ì?¡ã?
            var fontSize = obj.fontSize || top.fontSize;

            // 3. ?¨C???¡ª¨¦??¨¨¡ë?
            var color = obj.color || top.color;
            // ¨¨????????rgb¨¦??¨¨¡ë?
            color = (function () {
                var div = document.createElement('div');
                div.style.backgroundColor = color;
                document.body.appendChild(div);
                var c = window.getComputedStyle(div).backgroundColor;
                document.body.removeChild(div);
                return c;
            })();

            // 4. range¨¨?????
            var range = obj.range || top.range;
            // 5. ¨¦¢ã???????
            var opacity = obj.opacity || top.opacity;
            opacity = opacity / 100;

            // ¨¨????¡ª?????¡­???¨¦?????
            var span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.whiteSpace = 'nowrap';
            span.style.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
            span.innerText = obj.value;
            span.textContent = obj.value;
            document.body.appendChild(span);
            // ?¡À???¡ª?¨C???¡ª??¡­?????????
            this.width = span.clientWidth;
            // ?¡ì?¨¦?¡èdom?¡­????
            document.body.removeChild(span);

            // ????¡ì??¡ã???????????¡¯?????????????
            this.x = canvas.width;
            if (speed == 0) {
                this.x	= (this.x - this.width) / 2;
            }
            this.actualX = canvas.width;
            this.y = range[0] * canvas.height + (range[1] - range[0]) * canvas.height * Math.random();
            if (this.y < fontSize) {
                this.y = fontSize;
            } else if (this.y > canvas.height - fontSize) {
                this.y = canvas.height - fontSize;
            }

            this.moveX = speed;
            this.opacity = opacity;
            this.color = color;
            this.range = range;
            this.fontSize = fontSize;
        };

        this.draw = function () {
            // ????????¡è?¡ª?x?????????????¨C????
            context.shadowColor = 'rgba(0,0,0,'+ this.opacity +')';
            context.shadowBlur = 2;
            context.font = this.fontSize + 'px "microsoft yahei", sans-serif';
            if (/rgb\(/.test(this.color)) {
                context.fillStyle = 'rgba('+ this.color.split('(')[1].split(')')[0] +','+ this.opacity +')';
            } else {
                context.fillStyle = this.color;
            }
            // ???¨¨¡ë?
            context.fillText(this.value, this.x, this.y);
        };
    };

    data.forEach(function (obj, index) {
        store[index] = new Barrage(obj);
    });

    // ?????????????¨C????
    var draw = function () {
        for (var index in store) {
            var barrage = store[index];

            if (barrage && !barrage.disabled && time >= barrage.time) {
                if (!barrage.inited) {
                    barrage.init();
                    barrage.inited = true;
                }
                barrage.x -= barrage.moveX;
                if (barrage.moveX == 0) {
                    // ?????¡§?????????
                    barrage.actualX -= top.speed;
                } else {
                    barrage.actualX = barrage.x;
                }
                // ?¡ì?????¡À????
                if (barrage.actualX < -1 * barrage.width) {
                    // ???¨¦??¨¨??¨¨?????speed???0?????????
                    barrage.x = barrage.actualX;
                    // ¨¨???????????¨¨????¡§
                    barrage.disabled = true;
                }
                // ???????¨C¡ã?????????????????????
                barrage.draw();
            }
        }
    };

    // ?¡±?????????¡°
    var render = function () {
        // ????¨C¡ã?¡¤?????¡¯??¡±??¡ª?¨¦¡ª?
        time = video.currentTime;
        // ??¡­¨¦?¡è?¡±????
        context.clearRect(0, 0, canvas.width, canvas.height);

        // ???????¡±????
        draw();

        // ??¡ì????????¡°
        if (isPause == false) {
            requestAnimationFrame(render);
        }
    };

    // ¨¨¡ì?¨¦?¡®?¡è????
    video.addEventListener('play', function () {
        isPause = false;
        render();
    });
    video.addEventListener('pause', function () {
        isPause = true;
    });
    video.addEventListener('seeked', function () {
        // ¨¨¡¤?¨¨???¡¯??¡±?¨¦?¢ã¨¨????¡­?¡À?
        top.reset();
    });


    // ?¡¤??????¡ã???????¨C????
    this.add = function (obj) {
        store[Object.keys(store).length] = new Barrage(obj);
    };

    // ¨¦?????
    this.reset = function () {
        time = video.currentTime;
        // ?¡±??????¡­¨¦?¡è
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var index in store) {
            var barrage = store[index];
            if (barrage) {
                // ????¢ã??????¨C
                barrage.disabled = false;
                // ???????¡ª?¨¦¡ª???¡è?¨C??¡°??????????¨¨?¡ã¨¨?¡¤
                if (time < barrage.time) {
                    // ¨¨¡ì?¨¦?¡®?¡ª?¨¦¡ª??¡ã?????¡¯??¡±??¡ª?¨¦¡ª?
                    // barrage.disabled = true;
                    barrage.inited = null;
                } else {
                    // ¨¨¡ì?¨¦?¡®?¡ª?¨¦¡ª??¡è¡ì????¡¯??¡±??¡ª?¨¦¡ª?
                    barrage.disabled = true;
                }
            }
        }
    };
};