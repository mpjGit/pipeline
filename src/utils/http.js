import moment from "moment";
import Router from '@/router/index'

const serverUrl = "http://39.107.80.223:8003/"
const serverUrl_new = "http://47.95.192.6:30566/api/sense/"
// let serverUrl = "http://localhost:8005/"

import {saveAs} from 'file-saver'
import Store from "@/vuex/store";

const isMileagePage = () => {
	return Router?.history?.current?.path?.includes('mileage');
};

export const request = {
	post(url,params) {
		const isMileage = isMileagePage();
		const reqUrl = url.startsWith('/q/') ? serverUrl_new : serverUrl;
		return fetch(reqUrl + url, {
			method: 'POST',
			body: JSON.stringify(params),
			headers: {
				'Authorization': 'Bearer' + ' ' + window.token,
				'Content-Type': 'application/json; charset=utf-8',
				'router': isMileage ? 'mileage' : '',
			}
		}).then(res => {
			return res.json()
		})
	},
	get(url) {
		const isMileage = isMileagePage();
		const reqUrl = url.startsWith('/q/') ? serverUrl_new : serverUrl;
		return fetch(reqUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': 'Bearer' + ' ' + window.token,
				'router': isMileage ? 'mileage' : '',
			}
		}).then(res => {

			if(res.status==401||res.code==400){
				localStorage.setItem('statusCode',res.status)
				Store.dispatch('notification/clearAllWarnFault').then();
				window.location.href = "/#/login"
				//
			}
			return res.json()
		})
	},

	patch(url, params) {
		return fetch(serverUrl + url, {
			method: 'PATCH',
			body: JSON.stringify(params),
			headers: {
				'Authorization': 'Bearer' + ' ' + window.token,
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(json => json.json())
			.then(() =>{

			})
	},
	download(url, filename) {
		return fetch(serverUrl + url, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer' + ' ' + window.token
			}
		}).then((response) => response.blob())
			.then(blob => {
				if(!filename) {
					filename = 'VECTOR_SET_EXPORT_' + moment().format('lll');
				}
				saveAs(blob, filename)
			})
	}
}
