/**
 * api
 */
import request from './../utils/request'
export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    loginWithPopup(params) {
        return request({
            url: '/users/login/popup',
            method: 'post',
            data: params,
        })
    },
    register(params) {
        return request({
            url: '/users/register',
            method: 'post',
            data: params,
        })
    },
    getWelcomeAlbums(params) {
        return request({
            url: '/welcome/albums/get',
            method: 'post',
            data: params,
        })
    },
    getAlbums(params) {
        return request({
            url: '/me/albums/get',
            method: 'post',
            data: params,
        })
    },
    getWelcomeAlbum(params) {
        return request({
            url: '/welcome/album/get',
            method: 'post',
            data: params,
        })
    },
    getAlbum(params) {
        return request({
            url: '/me/album/get',
            method: 'post',
            data: params,
        })
    },
    createAlbum(params) {
        return request({
            url: '/me/album/create',
            method: 'post',
            data: params,
        })
    },
    updateAlbum(params) {
        return request({
            url: '/me/album/update',
            method: 'post',
            data: params,
        })
    },
    removeAlbum(params) {
        return request({
            url: '/me/album/remove',
            method: 'post',
            data: params,
        })
    },
    getWelcomeAlbumSong(params) {
        return request({
            url: '/welcome/album/song/get',
            method: 'post',
            data: params,
        })
    },
    getAlbumSong(params) {
        return request({
            url: '/me/album/song/get',
            method: 'post',
            data: params,
        })
    },
    createAlbumSong(params) {
        return request({
            url: '/me/album/song/create',
            method: 'post',
            data: params,
        })
    },
    updateAlbumSong(params) {
        return request({
            url: '/me/album/song/update',
            method: 'post',
            data: params,
        })
    },
    removeAlbumSong(params) {
        return request({
            url: '/me/album/song/remove',
            method: 'post',
            data: params,
        })
    },
    uploadAlbumCoverImage(params) {
        return request({
            url: '/me/album/uploadAlbumCoverImage',
            method: 'post',
            data: params,
        })
    },
    uploadAlbumSongs(params) {
        return request({
            url: '/me/album/uploadAlbumSongs',
            method: 'post',
            data: params,
        })
    },
    searchSongs(params) {
        return request({
            url: '/welcome/search/songs',
            method: 'post',
            data: params,
        })
    },
}