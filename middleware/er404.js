module.exports = (req, res) => {
  res.status(404).render('errors/404', {
    title: 'Страница не найдена'
});
};
