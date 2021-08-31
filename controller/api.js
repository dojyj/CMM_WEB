const host = "http://10.0.6.107:80";

export const fetchAPI = {
    get : (path) => fetch(`${host}${path}`),
    post : async (path, body, headers = {}) => {
        const url = `${host}${path}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                ...headers,
            },
            body: JSON.stringify(body),
        };

        const res = await fetch(url, options);
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            throw Error(data);
        }
    },
    patch : async (path, body, headers = {}) => {
        const url = `${host}${path}`;
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                ...headers,
            },
            body: JSON.stringify(body),
        };

        const res = await fetch(url, options);
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            throw Error(data);
        }
    }, 
    delete : async (path, headers = {}) => {
        const url = `${host}${path}`;
        const options = {
            method: "DELETE",
            headers: {
                ...headers,
            }
        }

        console.log(url);
        console.log(options);
        const res = await fetch(url, options);
        const data = await res.json();
        if (res.ok) {
            return data;
        } else {
            throw Error(data);
        }
    },
}