import axios from "axios";
const AuthStr = "Bearer " + localStorage.getItem("loginToken");
function getApiCall(url) {
    return axios
        .get(url, {
            headers: { Authorization: AuthStr },
        })
        .then((data) => {
            return data;
        });
}

function postApiCall(url, body) {
    return axios
        .post(url, body, {
            headers: { Authorization: AuthStr },
        })
        .then((data) => {
            return data;
        });
}

function putApiCall(url, body) {
    return axios
        .put(url, body, {
            headers: { Authorization: AuthStr },
        })
        .then((data) => {
            return data;
        });
}
function previewCall(url, body) {
    return axios
        .post(url, body, {
            dataType: "jsonp",
            contentType: "application/json",
            //headers: { Authorization: AuthStr },
        })
        .then((data) => {
            return data;
        });
}

export { getApiCall, postApiCall, previewCall, putApiCall };
