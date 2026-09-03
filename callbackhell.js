function test1(cb) {
    setTimeout(()=>{
        console.log("task1");
        cb();
    },4000)

}
function test2(cb) {
    setTimeout(()=>{
        console.log("task2");
        cb();
    },2000)

}

test1(()=>{
    test2();
});