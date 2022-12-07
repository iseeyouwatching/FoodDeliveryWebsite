$(document).ready(() => {
    $('#navbar_container').load('/src/pages/parts/navbar.html');
    $('#footer_container').load('/src/pages/parts/footer.html');

    $('#btnMinus').on("click",  event => {
        let oldValue = $('#btnTxt').html();

        if(oldValue <= 0){
            return;
        }
        let newVal = Number(oldValue) - 1;

        $("#btnTxt").html(newVal);
    });

    $('#btnPlus').on("click", event => {
        let oldValue = $('#btnTxt').html();

        let newVal = Number(oldValue) + 1;

        $("#btnTxt").html(newVal);
    });
});

// $('#btnMinus').on("click",  event => {
//     // let Field = document.getElementById('btnTxt');
//     let q = $('#btnTxt');
//     let oldValue = q.val();
//
//     if(oldValue <= 0){
//         return;
//     }
//     let newVal = oldValue - 1;
//
//     $("#btnTxt").html(newVal);
// });

// $('#btnPlus').on("click", event => {
//     // let Field = document.getElementById('btnTxt');
//     // let Field = $('#btnTxt').val();
//     let q = $('#btnTxt');
//     let oldValue = q.val();
//     console.log(oldValue)
//     let newVal = oldValue + 1;
//     $("#btnTxt").html(newVal);
// });