$(document).ready(function(){
    var book_name = $("input[name|='book_name'").val()
    var author = $("input[name|='author'").val()
    var reviewer = $("input[name|='reviewer'").val()
    var review = $("input[name|='review'").val()
    var image = $("input[name|='image")[0]
    var errorMsg = ''
    $('#add_review').submit((e)=>{
        if(image.files.length == 0){ 
            e.preventDefault()
            errorMsg = "Please Upload image"
            alert(errorMsg)
        }
    })
})