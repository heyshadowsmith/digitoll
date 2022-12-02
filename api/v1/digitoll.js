module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.send('READ Digitoll')
        return
    }

    if (req.method === 'POST') {
        res.send('CREATE Digitoll')
        return
    }

    if (req.method === 'PATCH') {
        res.send('UPDATE Digitoll')
        return
    }

    if (req.method === 'DELETE') {
        res.send ('DELETE Digitoll')
        return
    }

    res.send('Invalid method')
}
