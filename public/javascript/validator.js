$(document).ready(function(){
    var book_name = $("input[name|='book_name'").val()
    var author = $("input[name|='author'").val()
    var reviewer = $("input[name|='reviewer'").val()
    var review = $("input[name|='review'").val()
    var image = $("input[name|='image")
    var errorMsg = ''
    $('#add_review').submit((e)=>{
        
        if(book_name == ''||author == ''||reviewer == ''||review == ''||image.files.length == 0){
            console.log(`${book_name} ${author} ${reviewer}  ${image.files.length}`)
            e.preventDefault()
            errorMsg = "Fill all the fields and upload image"
            alert(errorMsg)
        }
    })
})