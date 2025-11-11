fetch("url that we are calling")
    .then(response => response.json()) //first fetch then response lambda response.json to turn into a javascript file
    .then(data => console.log(data)) //then after access the data that we are getting from the api
