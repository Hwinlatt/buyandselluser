const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export default {
    alert(data, Swal) {
        if (data.error) {
            let errorText = ''
            for (let i = 0; i < data.error.length; i++) {
                errorText += data.error[i] + '<br>'
            }
            Swal.fire({
                title: 'Error',
                html: errorText,
                icon: 'error',
            })
            return errorText;
        }
        if (data.success) {
            Swal.fire({
                title: 'Success',
                icon: 'success',
                html: data.success,
                timer: 2000,
                timerProgressBar: true,
            })
        }
    },
    error(err, Swal) {
        console.log(err);
        if (err.response.err.message) {
            if (err.response.err.message == 'Your email address is not verified.') {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    html: err.response.err.message + '<br><a href="verification">Email Verification</a>'
                })
            } else {
                Swal.fire(err.response.status.toString(), err.response.statusText, 'error');
            }
        }
    },
    getAgoTime(time) {
        console.log(time);
    },
    getDate(data) {
        let date = new Date(data);
        let d = date.getDate();
        let M = month[date.getMonth()];
        let Y = date.getFullYear();
        let H = date.getHours();
        let min = date.getMinutes();
        if (H > 12) {
            H -= 12;
        }
        return `${d}/${M}/${Y} ${H}:${min}`;
    },
    getProfileImage(name) {
        name = name.replace(' ', '+');
        return `https://ui-avatars.com/api/?name=${name}&color=7F9CF5&background=EBF4FF`;
    }
}