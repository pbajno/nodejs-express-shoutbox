$(document).ready(function(){
    $('.delete-shout').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/shout/'+id,
            success: function(response){
                alert('Deleting shout');
                window.location.href='/';

            },
            error: function(err){
                console.log(err);
            }
        })

    });
})


