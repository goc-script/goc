window.goc = (function () {
    var totalPreloades = 0;
    var progressLoaded = 0;
    var assetsLoadedTrue = false;
    var some = {};
    var testArray = [];
    
    function GOC_PRELOADER(array, type, noOfImages) {
        if (noOfImages == undefined) {
            console.log("Provide no of images as third argument in  goc.preloader(..,..,noOfImages) \n if it is combined type not needed ");
            noOfImages = array.length;
        }
        this.loadedImages = 0;
        this.loaded = [];
        this.temperoryArray = [];
        if (type[0] == "seperate" || type[0] == "s" || type[0] == "different" || type[0] == "diff") {
            for (let i = 0; i < array.length; i++) {
                this.loadedImages++;
                for (let j = 0; j < (noOfImages); j++) {
                    this.temperoryArray[j] = new Image();
                    this.temperoryArray[j].src = array[i] + "00" + j + "." + type[1];
                    if (j > (noOfImages - 2)) {
                        this.loaded.push(this.temperoryArray);
                        this.temperoryArray = [];
                    }
                }
                if (this.loadedImages == array.length) {
                    progressLoaded++;
                }
            }
        } else if (type[0] == "combined" || type[0] == "single" || type[0] == "c") {
            for (let i = 0; i < array.length; i++) {
                this.loadedImages++;
                this.temperoryArray[i] = new Image();
                this.temperoryArray[i].src = array[i] + "." + type[1];
                if (i > (array.length - 2)) {
                    this.loaded = this.temperoryArray;
                    this.temperoryArray = [];
                }
                if (this.loadedImages == array.length) {
                    progressLoaded++;
                }
            }
        }
        
        testArray = this.loaded;

        return this.loaded;
    }

    
    
    function GOC_SPRITE_ANIMATOR(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.i = 0;
        this.imagesStack = [];
        this.setOptions = function (options) {
            this.options = options || {
                imageCount: 10
                , flip: false
                , speed: 5
            };
        }
    }
    
    function GOC_SPRITE_ANIMATOR2(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setOptions = function (options) {
            this.options = options || {};
        }
        this.currentFrame = 0;
    }
    
    
    GOC_SPRITE_ANIMATOR.prototype.src = function (src) {
        for (var i = 0; i < (this.options.imageCount); i++) {
            this.imagesStack[i] = src[i];
        }
    }
    GOC_SPRITE_ANIMATOR.prototype.draw = function (ctx, elapsed, options) {
        this.setOptions(options);
        this.i += 10 * (elapsed / (this.options.speed * 100));
        if (this.i > (this.options.imageCount - 1)) {
            this.i = 0;
        }
        ctx.save();
        if (this.options.flip) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.imagesStack[Math.ceil(this.i)], 0, 0, this.width, this.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            ctx.translate(this.x - this.width, this.y);
            ctx.drawImage(this.imagesStack[Math.ceil(this.i)], 0, 0, this.width, this.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.restore();
    }
    GOC_SPRITE_ANIMATOR2.prototype.updateFrame = function (elapsed) {
        this.currentFrame += (this.options.cols - 1) * (elapsed / (this.options.speed * 100 || 500));
        if (this.currentFrame > (this.options.cols - 1)) {
            this.currentFrame = 0;
        }
        //this.currentFrame = ++this.currentFrame % this.options.cols;
        this.srcX = Math.ceil(this.currentFrame) * this.widthI;
        this.srcY = this.options.pose * (this.heightI + (this.options.fix || 0)) || 0;
    }
    GOC_SPRITE_ANIMATOR2.prototype.draw = function (ctx, elapsed, options) {
        this.setOptions(options);
        this.widthI = this.options.imageWidth / this.options.cols;
        this.heightI = this.options.imageHeight / this.options.rows;
        this.updateFrame(elapsed);
        ctx.drawImage(this.options.image, this.srcX, this.srcY, this.widthI, this.heightI, this.x, this.y, this.width, this.height);
    }

    class Vector2{
        constructor(x, y){
            this.x = x || 0;
            this.y = y || 0;
        }
        magnitude(){
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        squaredMagnitude(){
            return this.x * this.x + this.y * this.y;
        }
        equal(vector){
            if(this.x == vector.x && this.y == vector.y) return true 
            else return false;
        }
        addVector(vector){
            return new Vector2(this.x + vector.x, this.y + vector.y);
        }
        addVectorToThis(vector){
            this.x += vector.x;
            this.y += vector.y;
        }
        addMagnitude(vector){
            let aMagnitude = Math.sqrt(this.x * this.x + this.y * this.y);
            let bMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            return Math.sqrt(aMagnitude * aMagnitude + bMagnitude * bMagnitude + 2 * aMagnitude * bMagnitude * Math.cos(this.angle(vector)));
        }
        invert(){
            new Vector2(-this.x, -this.y);
        }
        invertThis(){
            this.x = -this.x;
            this.y = -this.y;
        }
        reduce(dt){
            this.x *= dt;
            this.y *= dt;
        }
        subtractMagnitude(vector){
            let invertedVector = vector.invert();
            return this.addMagnitude(invertedVector);
        }
        subtractVector(vector){
            return new Vector2(this.x - vector.x, this.y - vector.y);
        }
        subtractVectorToThis(vector){
            this.x - vector.x;
            this.y - vector.y;
        }
        dotProductMagnitude(vector){
            return this.magnitude() * vector.magnitude() * Math.cos(this.angle(vector));
        }
        dotProduct(vector){
            return this.x * vector.x + this.y * vector.y;
        }
        crossProduct(vector){
            console.log("Note cross product not possible in 2D plane");
            return this.magnitude() * vector.magnitude() * Math.sin(this.angle(vector));
        }
        angle(vector){
            let ro = this.dotProduct(vector) / (this.magnitude() * vector.magnitude());
            return Math.acos(ro);
        }
        normalize(){
            return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
        }
    }    

    class Pendulum{
        constructor(origin, length, radius, options){
            this.origin = origin || new Vector2(window.innerWidth / 2, 0);
            this.length = length || 150;
            this.radius = radius || 30;
            this.options = options || {};
            this.velocity = 0;
            this.angle = this.options.startAngle || Math.PI / 4;
            this.acceleration = 0;
            this.dampling = this.options.dampling || 0.995;
        }
        swing(dt, c){
            this.update(dt);
            this.draw(c);
        }
        update(dt){
            this.gravity = 9.81;
            this.acceleration = -1 * this.gravity * Math.sin(this.angle) * dt;
            this.velocity += this.acceleration;
            this.velocity *= this.dampling;
            this.position = new Vector2(
                this.length * Math.sin(this.angle),
                this.length * Math.cos(this.angle)
            );
            this.position.addVectorToThis(this.origin);
            this.angle += this.velocity;
        }
        draw(c){
            c.beginPath();
            c.moveTo(this.origin.x, this.origin.y);
            c.lineTo(this.position.x, this.position.y);
            c.stroke();
            c.closePath();
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
            c.fill();
            c.closePath();
        }
    }
    
    /*********************
     * JOY STICK
     **********************/
    function JoyStick(radius, innerRadius, options, outerX, outerY, innerX, innerY) {
        this.radius = radius;
        options = options || {};
        this.innerRadius = innerRadius;
        this.outerX = outerX;
        this.outerY = outerY;
        this.innerX = innerX;
        this.innerY = innerY;
        this.draw = (ctx) => {
            ctx.beginPath();
            ctx.fillStyle = options.outerFillStyle || 'rgb(255,165,0)';
            ctx.strokeStyle = 'black';
            ctx.arc(this.outerX, this.outerY, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = options.innerFillStyle || 'red';
            ctx.strokeStyle = 'black';
            ctx.arc(this.innerX, this.innerY, this.innerRadius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
    }
    
    function Vfp(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.update = () => {
            this.x = this.x2 - this.x1;
            this.y = this.y2 - this.y1;
        }
    }
    
    function Box(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.draw = (ctx) => {
            ctx.beginPath();
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    var ended = false;
    var posX, posY, startX, startY, endX, endY;
    var angle, move = false
        , startA = false;
    var dirX;
    var dirY;
    var joyStick;
    var xAxis = new Vfp();
    var fingerVector = new Vfp();
    
    function dotProduct(x1, y1, x2, y2) {
        return (x1 * x2) + (y1 * y2);
    }
    
    function magnitude(x, y) {
        return Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)));
    }
    
    function handleMove(e) {
        ended = false;
        move = true;
        startA = false;
        e.preventDefault();
        posX = Math.floor(e.touches[0].clientX);
        posY = Math.floor(e.touches[0].clientY);
        //display.innerHTML = 'X;- ' + posX + ' Y;- ' + posY;
    }
    
    function handleStart(e) {
        ended = false;
        move = false;
        startA = true;
        e.preventDefault();
        startX = Math.floor(e.touches[0].clientX);
        startY = Math.floor(e.touches[0].clientY);
        //start.innerHTML = 'Sx:- ' + startX + ' Sy:- ' + startY;
    }
    
    function handleEnd(e) {
        ended = true;
        move = false;
        startA = false;
        e.preventDefault();
        endX = Math.floor(e.changedTouches[event.changedTouches.length - 1].pageX);
        endY = Math.floor(e.changedTouches[event.changedTouches.length - 1].pageY);
        //end.innerHTML = 'eX:- ' + endX + ' eY:- '+ endY;
    }
    
    function update(elapsed, player) {
        if (startA) {
            joyStick.outerX = startX;
            joyStick.outerY = startY;
            joyStick.innerX = startX;
            joyStick.innerY = startY;
        }
        if (move) {
            joyStick.innerX = posX;
            joyStick.innerY = posY;
        }
        if (ended) {
            joyStick.innerX = startX;
            joyStick.innerY = startY;
        }
        
        xAxis.x1 = joyStick.outerX;
        xAxis.y1 = joyStick.outerY;
        xAxis.x2 = joyStick.outerX + joyStick.radius;
        xAxis.y2 = joyStick.outerY;
        fingerVector.x1 = joyStick.outerX;
        fingerVector.y1 = joyStick.outerY;
        fingerVector.x2 = joyStick.innerX;
        fingerVector.y2 = joyStick.innerY;
        fingerVector.update();
        xAxis.update();
        angle = Math.acos((dotProduct(xAxis.x, xAxis.y, fingerVector.x, fingerVector.y)) / (magnitude(xAxis.x, xAxis.y) * (magnitude(fingerVector.x, fingerVector.y))));
        dirX = Math.abs(Math.cos(angle)) * magnitude(fingerVector.x, fingerVector.y) / goc.joyStickPower;
        dirY = Math.abs(Math.sin(angle)) * magnitude(fingerVector.x, fingerVector.y) / goc.joyStickPower;
        if (isNaN(dirX)) {
            if (isNaN(dirY)) {
                dirX = 0;
                dirY = 0;
            }
        }
        if (ended == true) {
            dirX = 0;
            dirY = 0;
        }
        
        if (fingerVector.y2 < xAxis.y2 && (startX - fingerVector.x2) < 0) {
            player.x += dirX;
            player.y -= dirY;
        }
        if (fingerVector.y2 > xAxis.y2 && (startX - fingerVector.x2) < 0) {
            player.x += dirX;
            player.y += dirY;
        }
        if (fingerVector.y2 < xAxis.y2 && (startX - fingerVector.x2) > 0) {
            player.x -= dirX;
            player.y -= dirY;
        }
        if (fingerVector.y2 > xAxis.y2 && (startX - fingerVector.x2) > 0) {
            player.x -= dirX;
            player.y += dirY;
        }
        
    }
    
    function draw(ctx) {
        joyStick.draw(ctx);
    }
    
    
    
    
    /********************
     * JOY STICK
     ****************/
    
    var someRandomShit;
    var joystickActive = false;
    var then = Date.now();
    var now = 0;
    var elapsed = 0;
    var ctx, count = 0;
    var goc = {
        createCanvas: function (width, height, id) {
            let canvas = document.createElement("canvas");
            canvas.style.border = "2px solid black";
            canvas.id = id || "canvas";
            canvas.width = width;
            canvas.height = height;
            document.body.appendChild(canvas);
            ctx = canvas.getContext("2d");
        }
        , preload: function (array, type, noOfImages) {
            if (typeof (array) == "object" && array.length > 0) {
                return new GOC_PRELOADER(array, type, noOfImages);
            }
        }
        , update: function (update) {
            goc.update = update;
        }
        , draw: function (draw) {
            goc.draw = draw;
        }
        , empty: function () {
            
        }
        , start: function (oneTime) {
            now = Date.now();
            elapsed = now - then;
            count++;
            if (count < 2) {
                oneTime = oneTime || goc.empty;
                oneTime();
            }
            goc.update(elapsed, ctx);
            goc.draw(ctx, elapsed);
            if (joystickActive) {
                update(elapsed, goc.player);
                draw(ctx);
            }
            goc.dirX = dirX;
            goc.dirY = dirY;
            then = now;
            someRandomShit = requestAnimationFrame(goc.start);
        }
        , stop: function () {
            cancelAnimationFrame(someRandomShit);
        }
        , seperateSprite: function (x, y, width, height, options) {
            return new GOC_SPRITE_ANIMATOR(x, y, width, height, options);
        }
        , combinedSprite: function (x, y, width, height, options) {
            return new GOC_SPRITE_ANIMATOR2(x, y, width, height, options);
        }
        , createJoystick: function (obj, opt) {
            opt = opt || {};
            joystickActive = true;
            joyStick = new JoyStick(opt.outerRadius || 50, opt.innerRadius || 10, {
                innerFillStyle: opt.innerFillStyle
                , outerFillStyle: opt.outerFillStyle
            });
            goc.player = obj;
            goc.joyStickPower = opt.power || 50;
            canvas.addEventListener('touchmove', handleMove, {
                passive: false
            });
            canvas.addEventListener('touchstart', handleStart, {
                passive: false
            });
        
            canvas.addEventListener('touchend', handleEnd, {
                passive: false
            });
        }
        , removeJoystick: function () {
            joystickActive = false;
            canvas.removeEventListener('touchmove', handleMove, {
                passive: false
            });
            canvas.removeEventListener('touchstart', handleStart, {
                passive: false
            });
        
            canvas.removeEventListener('touchend', handleEnd, {
                passive: false
            });
        }
        , box: function (x, y) {
            return new Box(x, y);
        }
        , pendulum : function(origin, length, radius, options){
            return new Pendulum(origin, length, radius, options);
        }
        ,vector2 : function(x, y){
            return new Vector2(x, y);
        }
    }
    return goc;
}());
