const imageUpload = async (e) => {
    console.log("called");
    var fileIn = e.target;
    var file = fileIn.files[0];
    if (file && file.size < 5e6) {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "thaiphong")

        try {
          let res = await fetch('https://api.cloudinary.com/v1_1/dxsta80ho/image/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((response) => {
                e.preventDefault();
                console.log(response);
                console.log(response.secure_url);
            });
        } catch (error) {
          console.log(error);
        }
        
    } else {
        console.error("oversized file");
    }
}