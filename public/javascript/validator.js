$(document).ready(function(){
    
    
    function validator(event){

        $('.error').remove()

        var book_name = $("input[name|='book_name'")
        var author = $("input[name|='author'")
        var reviewer = $("input[name|='reviewer'")
        var review = $("input[name|='review'")
        var image = $("#review_image")
        var errorMsg = ''
        var errState = []


        function validating(elementValue,msg,e){
            console.log(elementValue.val().length)
            if(elementValue.val().length === 0){
                e.preventDefault()
                elementValue.after(`<small class="error text-red-500">${msg}</small>`)
                errState.push(true)
            }
        }

        function validateImage(){
            console.log(image)
            if(image.files.length === 0){
                event.preventDefault()
                alert('Image field is empty')
                errState.push(true)
            }
        }

        validating(book_name,"Book name is required",event)
        validating(author, "Author name is required",event)
        validating(review, "Review is required",event)
        validating(reviewer, "Reviewer is required",event)

        validateImage()

        !errState.includes(true) ? alert("Added") : ''

    }

    $('#add_review').submit(function(e){    
        validator(e)    
    })

})