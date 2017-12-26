/**
 * Created by fxc52 on 2017/12/4.
 */
/*!
 ** by zhangxinxu(.com)
 ** ???HTML5 video����?��?��????????��??��???????????????
 ** http://www.zhangxinxu.com/wordpress/?p=6386
 ** MIT License
 ** ???????��?????��????
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
    // ?????��??????
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

    // ?????��??????
    var store = {};

    // ????????????
    var isPause = true;
    // ?��??��??��?��??
    var time = video.currentTime;

    // ??��??��?���?��?
    var fontSize = 28;

    // ???????�C????
    var Barrage = function (obj) {
        // ??��??????��???????��
        this.value = obj.value;
        this.time = obj.time;
        // data????????????��????�C?����?����???��?????
        this.init = function () {
            // 1.txt. ����????
            var speed = top.speed;
            if (obj.hasOwnProperty('speed')) {
                speed = obj.speed;
            }
            if (speed !== 0) {
                // ��????��??��??��?????????����?????????��???����?
                speed = speed + obj.value.length / 100;
            }
            // 2. ??��??��?���?��?
            var fontSize = obj.fontSize || top.fontSize;

            // 3. ?�C???����??����?
            var color = obj.color || top.color;
            // ��????????rgb��??����?
            color = (function () {
                var div = document.createElement('div');
                div.style.backgroundColor = color;
                document.body.appendChild(div);
                var c = window.getComputedStyle(div).backgroundColor;
                document.body.removeChild(div);
                return c;
            })();

            // 4. range��?????
            var range = obj.range || top.range;
            // 5. ����???????
            var opacity = obj.opacity || top.opacity;
            opacity = opacity / 100;

            // ��????��?????��???��?????
            var span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.whiteSpace = 'nowrap';
            span.style.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
            span.innerText = obj.value;
            span.textContent = obj.value;
            document.body.appendChild(span);
            // ?��???��?�C???��??��?????????
            this.width = span.clientWidth;
            // ?��?��?��dom?��????
            document.body.removeChild(span);

            // ????��??��???????????��?????????????
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
            // ????????��?��?x?????????????�C????
            context.shadowColor = 'rgba(0,0,0,'+ this.opacity +')';
            context.shadowBlur = 2;
            context.font = this.fontSize + 'px "microsoft yahei", sans-serif';
            if (/rgb\(/.test(this.color)) {
                context.fillStyle = 'rgba('+ this.color.split('(')[1].split(')')[0] +','+ this.opacity +')';
            } else {
                context.fillStyle = this.color;
            }
            // ???����?
            context.fillText(this.value, this.x, this.y);
        };
    };

    data.forEach(function (obj, index) {
        store[index] = new Barrage(obj);
    });

    // ?????????????�C????
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
                    // ?????��?????????
                    barrage.actualX -= top.speed;
                } else {
                    barrage.actualX = barrage.x;
                }
                // ?��?????��????
                if (barrage.actualX < -1 * barrage.width) {
                    // ???��??��??��?????speed???0?????????
                    barrage.x = barrage.actualX;
                    // ��???????????��????��
                    barrage.disabled = true;
                }
                // ???????�C��?????????????????????
                barrage.draw();
            }
        }
    };

    // ?��?????????��
    var render = function () {
        // ????�C��?��?????��??��??��?����?
        time = video.currentTime;
        // ??����?��?��????
        context.clearRect(0, 0, canvas.width, canvas.height);

        // ???????��????
        draw();

        // ??��????????��
        if (isPause == false) {
            requestAnimationFrame(render);
        }
    };

    // ����?��?��?��????
    video.addEventListener('play', function () {
        isPause = false;
        render();
    });
    video.addEventListener('pause', function () {
        isPause = true;
    });
    video.addEventListener('seeked', function () {
        // ����?��???��??��?��?�㨨????��?��?
        top.reset();
    });


    // ?��??????��???????�C????
    this.add = function (obj) {
        store[Object.keys(store).length] = new Barrage(obj);
    };

    // ��?????
    this.reset = function () {
        time = video.currentTime;
        // ?��??????����?��
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var index in store) {
            var barrage = store[index];
            if (barrage) {
                // ????��??????�C
                barrage.disabled = false;
                // ???????��?����???��?�C??��??????????��?�㨨?��
                if (time < barrage.time) {
                    // ����?��?��?��?����??��?????��??��??��?����?
                    // barrage.disabled = true;
                    barrage.inited = null;
                } else {
                    // ����?��?��?��?����??���????��??��??��?����?
                    barrage.disabled = true;
                }
            }
        }
    };
};