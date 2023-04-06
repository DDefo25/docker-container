exports.error404Custom = (err, req, res) => {
    res.status(404).render('errors/404', {
        title: err.message,
    });
}