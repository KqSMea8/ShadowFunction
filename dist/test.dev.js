/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "cc3e0af729c7d1636423";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./demo/test.js")(__webpack_require__.s = "./demo/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/test.js":
/*!**********************!*\
  !*** ./demo/test.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/index */ "./src/index.ts");
/* harmony import */ var _src_index__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_index__WEBPACK_IMPORTED_MODULE_0__);


// test
window.seval = _src_index__WEBPACK_IMPORTED_MODULE_0__["safeEval"];
window.ShadowFunction = _src_index__WEBPACK_IMPORTED_MODULE_0__["ShadowFunction"];
window.WorkerFunction = _src_index__WEBPACK_IMPORTED_MODULE_0__["WorkerFunction"];
window.ShadowDocument = _src_index__WEBPACK_IMPORTED_MODULE_0__["ShadowDocument"];
window.ShadowPreact = _src_index__WEBPACK_IMPORTED_MODULE_0__["ShadowPreact"];
window.Strongbox = _src_index__WEBPACK_IMPORTED_MODULE_0__["Strongbox"];

// csp("script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:; report-uri https://www.alibaba-inc.com/xss")
// // 移除无效
// let meta = document.getElementsByTagName('meta')
// meta = meta[meta.length -1]
// meta.parentElement.removeChild(meta)


Object(_src_index__WEBPACK_IMPORTED_MODULE_0__["jsonp"])({
  url: "http://suggest.taobao.com/sug?code=utf-8&q=iphoneX"
}).then(data => {
  console.log("jsonp:", data);
});

console.log(9033);

// new ShadowFunction(`
//     fn({
//       callback: function (k) {
//         console.log(arguments.callee)
//         k.valueOf.__proto__.constructor('alert(99)')()
//       }
//     })
// `)({
//   console,
//   fn: function (cb) {
//     cb.callback({k: 7})
//   }
// })

new _src_index__WEBPACK_IMPORTED_MODULE_0__["ShadowPreact"](`
  document.body.append($template.content);
  let ccc = preact.createElement(
    "button",
    {
      onClick: function (e) {
        alert("hi!");
        console.log(ccc, 999)
      }
    },
    "Click Me"
  )
  function rrr (width) {
    preact.render(preact.createElement(
      "div",
      { id: "foo" },
      preact.createElement(
        "img",
        {
          src: "https://wx1.sinaimg.cn/thumb180/00668JlNly1fwv2e16ez3j30k0140q6d.jpg",
          width: width,
          onClick: function (e) {
            alert(123)
            console.log(this)
          }
        }
      ),
      ccc
    ), document.getElementById('app'));
  }
  let i = 1
  // setInterval(() => {
    rrr(400 * i)
    // i++
    // if (i > 100) i =1
  // }, 0)
  console.log(document.getElementById('app'))
`)({ console, alert: function (str) {
    alert('eeee' + str);
  }, setInterval: function (fn, t) {
    console.log(t);setInterval(function () {
      fn();
    }, t);
  } });

/***/ }),

/***/ "./src/freeze/index.ts":
/*!*****************************!*\
  !*** ./src/freeze/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../objectType/index */ "./src/objectType/index.ts");
function freeze(object, deep, exclude) {
    if (deep === void 0) {
        deep = false;
    }
    exclude = index_1.getObjectType(exclude) === 'Object' ? exclude : {};
    if (deep) {
        var propNames = Object.getOwnPropertyNames(object);
        // Freeze properties before freezing self
        for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
            var name_1 = propNames_1[_i];
            var value = object[name_1];
            var ignore = exclude[name_1];
            if (!value) break;
            if (ignore) {
                freeze(value.prototype, true, exclude);
                freeze(value.__proto__, true, exclude);
                break;
            }
            if (isFrozen(value)) break;
            var descriptor = Object.getOwnPropertyDescriptor(object, name_1) || {};
            if (!descriptor.writable) break;
            object[name_1] = value && typeof value === 'object' ? freeze(value, true) : value;
        }
    }
    return Object.freeze(object);
}
exports.freeze = freeze;
function isFrozen(obj) {
    return Object.isFrozen(obj);
}
exports.isFrozen = isFrozen;

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ./sandbox/index */ "./src/sandbox/index.ts");
exports.Sandbox = index_1.Sandbox;
var index_2 = __webpack_require__(/*! ./shadowFunction/index */ "./src/shadowFunction/index.ts");
exports.ShadowFunction = index_2.ShadowFunction;
var index_3 = __webpack_require__(/*! ./shadowDocument/index */ "./src/shadowDocument/index.ts");
exports.ShadowDocument = index_3.ShadowDocument;
var index_4 = __webpack_require__(/*! ./shadowPreact/index */ "./src/shadowPreact/index.ts");
exports.ShadowPreact = index_4.ShadowPreact;
var index_5 = __webpack_require__(/*! ./strongbox/index */ "./src/strongbox/index.ts");
exports.Strongbox = index_5.Strongbox;
var index_6 = __webpack_require__(/*! ./workerFunction/index */ "./src/workerFunction/index.ts");
exports.WorkerFunction = index_6.WorkerFunction;
var index_7 = __webpack_require__(/*! ./try-again/index */ "./src/try-again/index.ts");
exports.TryAgain = index_7.TryAgain;
var index_8 = __webpack_require__(/*! ./safeEval/index */ "./src/safeEval/index.ts");
exports.safeEval = index_8.safeEval;
var index_9 = __webpack_require__(/*! ./jsonp/index */ "./src/jsonp/index.ts");
exports.jsonp = index_9.jsonp;

/***/ }),

/***/ "./src/jsonp/index.ts":
/*!****************************!*\
  !*** ./src/jsonp/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../sandbox/index */ "./src/sandbox/index.ts");
var index_2 = __webpack_require__(/*! ../try-again/index */ "./src/try-again/index.ts");
var index_3 = __webpack_require__(/*! ../url/index */ "./src/url/index.ts");
// callback 自增 id
var JSONP_AUTO_INCREMENT_ID = 0;
var sandbox = new index_1.Sandbox(true);
var sandboxWindow = sandbox.window;
var sandboxDocument = sandboxWindow.document;
var jsonp = function (options) {
    return new Promise(function (resolve, reject) {
        var url = options.url,
            data = options.data,
            callbackKey = options.callbackKey,
            callbackName = options.callbackName,
            timeout = options.timeout;
        var script;
        var tryObj;
        var payload = '';
        var timeoutId;
        data = data || {};
        timeout = timeout || 30000;
        callbackKey = callbackKey || 'callback';
        callbackName = callbackName || '__call__' + ++JSONP_AUTO_INCREMENT_ID;
        data[callbackKey] = callbackName;
        sandboxWindow[callbackName] = function (data) {
            delete sandboxWindow[callbackName];
            if (Object.prototype.toString.call(data) === '[object Object]') {
                resolve(data);
            } else {
                reject();
            }
        };
        payload = index_3.object2params(data);
        if (!url || typeof url !== 'string') return reject('params url is not defined');
        url += (url.indexOf('?') !== -1 ? '&' : '?') + payload;
        // 异常尝试
        tryObj = new index_2.TryAgain(send, { timeout: 3000, polls: 2 });
        // abort
        function abort() {
            clearTimeout(timeoutId);
            window.removeEventListener('online', send, false);
            try {
                sandboxDocument.documentElement.removeChild(script);
            } catch (e) {
                //
            }
        }
        // 错误处理
        function over() {
            abort();
            tryObj.try();
            if (tryObj.polls === 0) {
                reject();
            }
        }
        function send() {
            script = sandboxDocument.createElement('SCRIPT');
            script.charset = 'utf-8';
            script.src = url;
            // failed
            script.onerror = over;
            script.onload = function () {
                abort();
                tryObj.over();
            };
            sandboxDocument.documentElement.appendChild(script);
        }
        timeoutId = setTimeout(over, timeout);
        send();
        // 断网重连
        if (navigator.onLine === false) {
            tryObj.stop();
            window.addEventListener('online', send, false);
        }
    });
};
exports.jsonp = jsonp;

/***/ }),

/***/ "./src/objectType/index.ts":
/*!*********************************!*\
  !*** ./src/objectType/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var getObjectType = function (object) {
    var objectStr = Object.prototype.toString.call(object);
    var objectType = /\s*\[(\w+) (\w+)\]\s*/.exec(objectStr) || [];
    switch (objectType[1]) {
        case 'object':
            return objectType[2];
        case 'native':
            return 'native';
    }
    return 'unknow';
};
exports.getObjectType = getObjectType;

/***/ }),

/***/ "./src/safeEval/index.ts":
/*!*******************************!*\
  !*** ./src/safeEval/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../sandbox/index */ "./src/sandbox/index.ts");
// snadbox && shadowSandbox
var shadowSandbox = new index_1.Sandbox();
var shadowWindow = shadowSandbox.window;
var safeEval = shadowWindow.eval;
exports.safeEval = safeEval;

/***/ }),

/***/ "./src/sandbox/index.ts":
/*!******************************!*\
  !*** ./src/sandbox/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Sandbox = /** @class */function () {
    function Sandbox(white) {
        var sandbox = this.sandbox = document.createElement('iframe');
        var documentElement = document.documentElement;
        sandbox.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        sandbox.style.display = 'none';
        documentElement.appendChild(sandbox);
        var contentWindow = this.sandbox.contentWindow;
        var contentDocument = this.sandbox.contentDocument;
        this.window = contentWindow;
        this.content = this.document = contentDocument;
        this.open().write('').close();
        this.window = contentWindow.window;
        if (!white) this.exit();
        return this;
    }
    Sandbox.prototype.open = function () {
        this.content.open();
        return this;
    };
    Sandbox.prototype.write = function (head, body, context) {
        if (head || body) {
            context = '<!DOCTYPE html>' + '<html>' + '<head>' + (head || '') + '</head>' + '<body>' + (body || '') + '</body>' + '</html>';
        } else {
            context = '<head><meta charset="utf-8"></head>';
        }
        this.content.write(context);
        return this;
    };
    Sandbox.prototype.close = function () {
        this.content.close();
        return this;
    };
    Sandbox.prototype.exit = function () {
        this.sandbox.src = 'about:blank';
        var parentNode = this.sandbox.parentNode;
        parentNode && parentNode.removeChild(this.sandbox);
    };
    return Sandbox;
}();
exports.Sandbox = Sandbox;

/***/ }),

/***/ "./src/shadowDocument/index.ts":
/*!*************************************!*\
  !*** ./src/shadowDocument/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../shadowFunction/index */ "./src/shadowFunction/index.ts");
var DOCUMENT = document;
// ShadowDocument
var ShadowDocument = /** @class */function () {
    function ShadowDocument(root, template, setting) {
        this.o = 0;
        this.allowTagName = {
            'DIV': true,
            'B': true,
            'P': true,
            'DL': true,
            'DT': true,
            'DD': true,
            'EM': true,
            'HR': true,
            'UL': true,
            'LI': true,
            'OL': true,
            'TD': true,
            'TH': true,
            'TR': true,
            'TT': true,
            'IMG': true,
            'NAV': true,
            'SUP': true,
            'SUB': true,
            'SPAN': true,
            'FONT': true,
            'STYLE': true,
            'SMALL': true,
            'LABEL': true,
            'INPUT': true,
            'TABLE': true,
            'TBODY': true,
            'THEAD': true,
            'TFOOT': true,
            'BUTTON': true,
            'FOOTER': true,
            'HEADER': true,
            'STRONG': true
        };
        this.TREE = {
            0: root.createShadowRoot ? root.createShadowRoot() : root
        };
        Object.assign(this.allowTagName, setting);
        this.shadowFunction = new index_1.ShadowFunction({});
        this.shadowFunction = this.shadowFunction(this.reject(template))({
            __$template__: template
        });
        this.sandbox = this.shadowFunction.sandbox;
        this.parallel(this.sandbox.document);
        // @ts-ignore
        return this.shadowFunction.run.bind(this);
    }
    ShadowDocument.prototype.reject = function (template) {
        var reject = "\n      (function () {\n        var __$getEventTarget__ = function (object) {\n          if (!object) return\n          if ((object.__proto__ + '').indexOf('EventTarget') !== -1) {\n            return object.__proto__\n          } else {\n            return __$getEventTarget__(object.__proto__)\n          }\n        }\n        var __$EventTarget__ = __$getEventTarget__(window)\n        __$EventTarget__.addEventListener = function (name, fn, opt) {\n          let props = 'on-' + name\n          this.setAttribute(props, name)\n          if (this[props]) {\n            this[props].push(fn)\n          } else {\n            this[props] = [fn]\n          }\n        }\n        __$EventTarget__.removeEventListener = function (name, fn, opt) {\n          let props = 'on-' + name\n          this.removeAttribute(props)\n          if (!this[props]) return\n          let index = this[props].indexOf(fn)\n          if (index !== -1) {\n            this[props].splice(index, 1)\n          }\n        }\n      })();\n      window['$template'] = document.createElement('template');\n    ";
        return reject + 'window[\'$template\'].innerHTML = \'' + template + '\';';
    };
    ShadowDocument.prototype.uuid = function (node, uuid) {
        uuid = parseInt(node.parentNode ? node.parentNode.uuid || 0 : 0, 10);
        uuid++;
        this.o++;
        uuid = uuid + '.' + this.o;
        if (!node.uuid) node.uuid = uuid;
        return uuid;
    };
    ShadowDocument.prototype.iterator = function (nodes) {
        if (nodes.nextNode) return nodes;
        return DOCUMENT.createNodeIterator(nodes, NodeFilter.SHOW_ALL, null);
    };
    ShadowDocument.prototype.walker = function (nodes, target, del) {
        if (del === void 0) {
            del = false;
        }
        var node = nodes.nextNode();
        while (node) {
            node = nodes.nextNode();
            if (!node) break;
            if (node.uuid) continue;
            this.uuid(node);
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    if (del) {
                        this.removeElement(node, target);
                    } else {
                        this.createElement(node, target);
                        for (var i = 0; i < node.attributes.length; i++) {
                            this.setAttribute(node.attributes[i].name, node);
                        }
                    }
                    break;
                case Node.TEXT_NODE:
                    if (del) {
                        this.removeTextNode(node, target);
                    } else {
                        this.createTextNode(node, target);
                    }
                    break;
            }
        }
    };
    ShadowDocument.prototype.getParentId = function (node, target) {
        return (node.parentNode ? node.parentNode.uuid : target.uuid) || 0;
    };
    ShadowDocument.prototype.createElement = function (node, target) {
        var name = node.nodeName;
        var uuid = node.uuid;
        var puuid = this.getParentId(node, target);
        switch (name) {
            case this.allowTagName[name] ? name : null:
                this.TREE[uuid] = DOCUMENT.createElement(name);
                break;
            default:
                throw new Error("The tag name provided ('" + name + "') is not a valid name.");
        }
        this.TREE[puuid].appendChild(this.TREE[uuid]);
    };
    ShadowDocument.prototype.removeElement = function (node, target) {
        var uuid = node.uuid;
        var puuid = this.getParentId(node, target);
        if (this.TREE[puuid] && this.TREE[uuid]) {
            this.TREE[puuid].removeChild(this.TREE[uuid]);
            delete this.TREE[uuid];
        }
    };
    ShadowDocument.prototype.createTextNode = function (node, target) {
        var uuid = node.uuid;
        var puuid = this.getParentId(node, target);
        var text = node.textContent;
        this.TREE[uuid] = DOCUMENT.createTextNode(text);
        if (this.TREE[puuid]) {
            this.TREE[puuid].appendChild(this.TREE[uuid]);
        }
    };
    ShadowDocument.prototype.removeTextNode = function (node, target) {
        var uuid = node.uuid;
        var puuid = this.getParentId(node, target);
        if (this.TREE[puuid] && this.TREE[uuid]) {
            this.TREE[puuid].removeChild(this.TREE[uuid]);
            delete this.TREE[uuid];
        }
    };
    ShadowDocument.prototype.setAttribute = function (name, node) {
        var _this = this;
        var attri = this.TREE[node.uuid];
        var allow = this.allowTagName[node.tagName];
        var value = node.getAttribute(name);
        switch (name) {
            case 'on-click':
            case 'on-touchstart':
            case 'on-touchmove':
            case 'on-touchend':
            case 'on-focus':
            case 'on-mouseover':
            case 'on-mouseout':
            case 'on-mousedown':
            case 'on-mouseup':
            case 'on-mousemove':
            case 'on-change':
            case 'on-select':
            case 'on-keypress':
            case 'on-keydown':
            case 'on-keyup':
            case 'on-submit':
            case 'on-reset':
                if (node.hasEventListener) return;
                node.hasEventListener = true;
                attri.addEventListener(value, function (e) {
                    _this.shadowFunction.run("\n            for (let i = 0; i < event.length; i++) {\n              let even = event[i]\n              typeof(even) === 'function' && even.call(node, e)\n            }\n          ")({ event: node[name], node: node, e: _this.shadowEvent(e) });
                }, false);
                return;
        }
        if (typeof allow === 'function') {
            if (!allow(name, value)) {
                return;
            }
        }
        if (attri) {
            attri.setAttribute(name, value);
        }
    };
    ShadowDocument.prototype.setCharacterData = function (node) {
        var char = this.TREE[node.uuid];
        if (char) char.textContent = node.textContent;
    };
    ShadowDocument.prototype.shadowEvent = function (e) {
        var event = {};
        for (var k in e) {
            switch (typeof e[k]) {
                case 'string':
                case 'number':
                case 'boolean':
                    event[k] = e[k];
                    break;
            }
        }
        return event;
    };
    ShadowDocument.prototype.parallel = function (root) {
        var _this = this;
        this.shadowFunction.run('observer()')({ observer: function () {
                new MutationObserver(function (records) {
                    for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
                        var record = records_1[_i];
                        var target = record.target;
                        switch (record.type) {
                            case 'attributes':
                                // @ts-ignore
                                _this.setAttribute(record.attributeName, target);
                                break;
                            case 'characterData':
                                _this.setCharacterData(target);
                                break;
                            case 'childList':
                                // @ts-ignore
                                for (var _a = 0, _b = record.addedNodes; _a < _b.length; _a++) {
                                    var node = _b[_a];
                                    _this.walker(_this.iterator(node), target);
                                }
                                // @ts-ignore
                                for (var _c = 0, _d = record.removedNodes; _c < _d.length; _c++) {
                                    var node = _d[_c];
                                    _this.walker(_this.iterator(node), target, true);
                                }
                                break;
                        }
                    }
                }).observe(root, {
                    subtree: true,
                    attributes: true,
                    childList: true,
                    characterData: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                });
            } });
    };
    return ShadowDocument;
}();
exports.ShadowDocument = ShadowDocument;

/***/ }),

/***/ "./src/shadowFunction/index.ts":
/*!*************************************!*\
  !*** ./src/shadowFunction/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../objectType/index */ "./src/objectType/index.ts");
var index_2 = __webpack_require__(/*! ../sandbox/index */ "./src/sandbox/index.ts");
var index_3 = __webpack_require__(/*! ../safeEval/index */ "./src/safeEval/index.ts");
// ShadowFunction
var ShadowFunction = /** @class */function () {
    function ShadowFunction(scriptStr) {
        this.sandbox = new index_2.Sandbox();
        this.shadowToString = this.sandbox.window.Object.toString;
        this.ShadowFunction = this.sandbox.window.Function;
        this.allowProtoProperties = {
            Node: ['nodeName', 'nodeType', 'textContent'],
            Element: ['style', 'onblur', 'onfocus', 'onscroll', 'offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'innerText', 'setAttribute', 'removeAttribute', 'createTextNode', 'addEventListener', 'getElementsByTagName'],
            HTMLElement: [],
            HTMLBodyElement: [],
            HTMLDivElement: [],
            HTMLUListElement: [],
            HTMLLIElement: [],
            HTMLVideoElement: [],
            HTMLAudioElement: [],
            HTMLSelectElement: [],
            HTMLOptionElement: [],
            HTMLInputElement: [],
            HTMLSpanElement: [],
            HTMLDListElement: [],
            HTMLFontElement: [],
            HTMLHeadingElement: [],
            HTMLParagraphElement: []
        };
        this.tracker = function (param) {
            console.log('Event Log:', param);
        };
        switch (typeof scriptStr) {
            case 'object':
                // @ts-ignore
                return this.setAllowProtoProperties(scriptStr);
            case 'string':
                // @ts-ignore
                return this.runShadow(scriptStr);
            default:
                throw new Error('Uncaught SyntaxError: Unexpected identifier');
        }
    }
    ShadowFunction.prototype.event = function (tracker) {
        this.tracker = tracker;
    };
    ShadowFunction.prototype.getAllowProtoProperties = function (constructorName) {
        var properties = this.allowProtoProperties;
        var allowProperties = properties[constructorName];
        if (typeof allowProperties === 'function') return allowProperties();
        if (/HTML(\w+)Element/.exec(constructorName)) {
            allowProperties = allowProperties.concat(properties['HTMLElement'], properties['Element'], properties['Node']);
        }
        return allowProperties;
    };
    ShadowFunction.prototype.setAllowProtoProperties = function (allowProperties) {
        Object.assign(this.allowProtoProperties, allowProperties);
        return this.runShadow.bind(this);
    };
    ShadowFunction.prototype.proxy = function (object, origin) {
        var safeSetter = this.safeSetter.bind(this);
        var safeGetter = this.safeGetter.bind(this);
        var propNames = Object.getOwnPropertyNames(object);
        var Proxy = index_3.safeEval('(Proxy)');
        return new Proxy(index_3.safeEval("({" + (propNames.length ? propNames.join(':{},') + ':{}' : '') + "})"), {
            get: function (_target, name) {
                return safeGetter(object, name);
            },
            set: function (_target, name, value) {
                return safeSetter(origin, name, value);
            }
        });
    };
    ShadowFunction.prototype.checkIsSmuggled = function (object) {
        var propNames = Object.getOwnPropertyNames(object);
        var isSmuggled = false;
        for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
            var name_1 = propNames_1[_i];
            var value = object[name_1];
            var valueType = typeof value;
            if (value) {
                switch (valueType) {
                    case 'object':
                        if (this.checkIsSmuggled(value)) {
                            isSmuggled = true;
                        }
                        break;
                    case 'string':
                    case 'number':
                    case 'boolean':
                        break;
                    case 'function':
                        if (value.toString.constructor !== this.shadowToString.constructor) {
                            isSmuggled = true;
                        }
                        break;
                    default:
                        isSmuggled = true;
                        break;
                }
            }
        }
        return isSmuggled;
    };
    ShadowFunction.prototype.proxyObject = function (target, name, value) {
        if (index_1.getObjectType(value) !== 'Object' && value.toString.constructor === this.shadowToString.constructor) {
            if (!this.checkIsSmuggled(value)) {
                target[name] = value;
            } else {
                throw new Error('Uncaught SyntaxError: Do not enclose custom functions in Element');
            }
        } else {
            target[name] = this.proxyEach(value);
        }
    };
    ShadowFunction.prototype.proxyEach = function (object) {
        if (!object) return index_3.safeEval('(undefined)');
        var target = index_3.safeEval('({})');
        var prototype = index_1.getObjectType(object);
        var propNames = Object.getOwnPropertyNames(object);
        var whitelist = this.getAllowProtoProperties(prototype);
        if (whitelist) {
            propNames = propNames.concat(whitelist);
        }
        for (var _i = 0, propNames_2 = propNames; _i < propNames_2.length; _i++) {
            var name_2 = propNames_2[_i];
            var value = object[name_2];
            var valueType = typeof value;
            if (value) {
                switch (valueType) {
                    case 'object':
                        this.proxyObject(target, name_2, value);
                        break;
                    case 'function':
                        target[name_2] = value.bind(object);
                        break;
                    case 'string':
                    case 'number':
                    case 'boolean':
                        target[name_2] = value;
                        break;
                    default:
                        target[name_2] = '[unknow type]';
                        break;
                }
            }
        }
        return this.proxy(target, object);
    };
    ShadowFunction.prototype.safeSetter = function (object, name, value) {
        var valueType = typeof value;
        var prototype = index_1.getObjectType(object);
        var propNames = Object.getOwnPropertyNames(object);
        var whitelist = this.allowProtoProperties[prototype];
        if (whitelist) {
            propNames = propNames.concat(whitelist);
        }
        if (propNames.indexOf(name) === -1) {
            this.tracker({
                object: object,
                name: name,
                action: 'write',
                value: value
            });
            return;
        }
        switch (valueType) {
            case 'string':
            case 'number':
            case 'boolean':
                object[name] = value;
                break;
            case 'function':
                object[name] = this.safeReturnFunction(value, object);
                break;
            default:
                this.tracker({
                    object: object,
                    name: name,
                    action: 'write',
                    value: value
                });
                break;
        }
        return;
    };
    ShadowFunction.prototype.safeGetter = function (object, name) {
        var value = object[name];
        var valueType = typeof value;
        var prototype = index_1.getObjectType(object);
        var propNames = Object.getOwnPropertyNames(object);
        var whitelist = this.allowProtoProperties[prototype];
        if (whitelist) {
            propNames = propNames.concat(whitelist);
        }
        if (propNames.indexOf(name) === -1) {
            this.tracker({
                object: object,
                name: name,
                action: 'read'
            });
            return;
        }
        switch (valueType) {
            case 'string':
            case 'number':
            case 'object':
            case 'boolean':
                return value;
            case 'function':
                return this.safeReturnFunction(value, object);
            default:
                return;
        }
    };
    ShadowFunction.prototype.safeReturnFunction = function (value, object) {
        return new this.ShadowFunction('value', 'object', 'safeReturnFunction', 'proxy', "\n      return (function () {\n        return function () {\n          return proxy(value.apply(object, proxy(arguments)));\n        };\n      })();\n    ")(value, object, this.safeReturnFunction, this.proxyEach.bind(this));
    };
    ShadowFunction.prototype.runShadow = function (scriptStr) {
        this.shadowFunction = new this.ShadowFunction('(function(){with(arguments[0]) {' + scriptStr + '}})(this)');
        return this.runScript.bind(this);
    };
    ShadowFunction.prototype.runScript = function (that, event) {
        var target = this.proxyEach(that);
        var shadowFunction = this.shadowFunction;
        event && this.event(event);
        shadowFunction.apply(target);
        return {
            run: this.runShadow.bind(this),
            proxy: this.proxyEach.bind(this),
            sandbox: this.sandbox
        };
    };
    return ShadowFunction;
}();
exports.ShadowFunction = ShadowFunction;

/***/ }),

/***/ "./src/shadowPreact/index.ts":
/*!***********************************!*\
  !*** ./src/shadowPreact/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../shadowDocument/index */ "./src/shadowDocument/index.ts");
var PREACR = "!function(){\"use strict\";function e(e,t){var n,o,r,i,l=A;for(i=arguments.length;i-- >2;)P.push(arguments[i]);t&&null!=t.children&&(P.length||P.push(t.children),delete t.children);while(P.length)if((o=P.pop())&&void 0!==o.pop)for(i=o.length;i--;)P.push(o[i]);else\"boolean\"==typeof o&&(o=null),(r=\"function\"!=typeof e)&&(null==o?o=\"\":\"number\"==typeof o?o+=\"\":\"string\"!=typeof o&&(r=!1)),r&&n?l[l.length-1]+=o:l===A?l=[o]:l.push(o),n=r;var a=new T;return a.nodeName=e,a.children=l,a.attributes=null==t?void 0:t,a.key=null==t?void 0:t.key,void 0!==M.vnode&&M.vnode(a),a}function t(e,t){for(var n in t)e[n]=t[n];return e}function n(e,t){null!=e&&(\"function\"==typeof e?e(t):e.current=t)}function o(n,o){return e(n.nodeName,t(t({},n.attributes),o),arguments.length>2?[].slice.call(arguments,2):n.children)}function r(e){!e.__d&&(e.__d=!0)&&1==E.push(e)&&(M.debounceRendering||W)(i)}function i(){var e;while(e=E.pop())e.__d&&x(e)}function l(e,t,n){return\"string\"==typeof t||\"number\"==typeof t?void 0!==e.splitText:\"string\"==typeof t.nodeName?!e._componentConstructor&&a(e,t.nodeName):n||e._componentConstructor===t.nodeName}function a(e,t){return e.__n===t||e.nodeName.toLowerCase()===t.toLowerCase()}function u(e){var n=t({},e.attributes);n.children=e.children;var o=e.nodeName.defaultProps;if(void 0!==o)for(var r in o)void 0===n[r]&&(n[r]=o[r]);return n}function p(e,t){var n=t?document.createElementNS(\"http://www.w3.org/2000/svg\",e):document.createElement(e);return n.__n=e,n}function c(e){var t=e.parentNode;t&&t.removeChild(e)}function s(e,t,o,r,i){if(\"className\"===t&&(t=\"class\"),\"key\"===t);else if(\"ref\"===t)n(o,null),n(r,e);else if(\"class\"!==t||i)if(\"style\"===t){if(r&&\"string\"!=typeof r&&\"string\"!=typeof o||(e.style.cssText=r||\"\"),r&&\"object\"==typeof r){if(\"string\"!=typeof o)for(var l in o)l in r||(e.style[l]=\"\");for(var l in r)e.style[l]=\"number\"==typeof r[l]&&!1===D.test(l)?r[l]+\"px\":r[l]}}else if(\"dangerouslySetInnerHTML\"===t)r&&(e.innerHTML=r.__html||\"\");else if(\"o\"==t[0]&&\"n\"==t[1]){var a=t!==(t=t.replace(/Capture$/,\"\"));t=t.toLowerCase().substring(2),r?o||e.addEventListener(t,_,a):e.removeEventListener(t,_,a),(e.__l||(e.__l={}))[t]=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.apply(this,t)}}else if(\"list\"!==t&&\"type\"!==t&&!i&&t in e){try{e[t]=null==r?\"\":r}catch(e){}null!=r&&!1!==r||\"spellcheck\"==t||e.removeAttribute(t)}else{var u=i&&t!==(t=t.replace(/^xlink:?/,\"\"));null==r||!1===r?u?e.removeAttributeNS(\"http://www.w3.org/1999/xlink\",t.toLowerCase()):e.removeAttribute(t):\"function\"!=typeof r&&(u?e.setAttributeNS(\"http://www.w3.org/1999/xlink\",t.toLowerCase(),function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.apply(this,t)}):e.setAttribute(t,function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.apply(this,t)}))}else e.className=r||\"\"}function _(e){return this.__l[e.type](M.event&&M.event(e)||e)}function f(){var e,t;for(t=0;t<V.length;++t)e=V[t],M.afterMount&&M.afterMount(e),e.componentDidMount&&e.componentDidMount();V.length=0}function d(e,t,n,o,r,i){H++||(R=null!=r&&void 0!==r.ownerSVGElement,B=null!=e&&!(\"__preactattr_\"in e));var l=h(e,t,n,o,i);return r&&l.parentNode!==r&&r.appendChild(l),--H||(B=!1,i||f()),l}function h(e,t,n,o,r){var i=e,l=R;if(null!=t&&\"boolean\"!=typeof t||(t=\"\"),\"string\"==typeof t||\"number\"==typeof t)return e&&void 0!==e.splitText&&e.parentNode&&(!e._component||r)?e.nodeValue!=t&&(e.nodeValue=t):(i=document.createTextNode(t),e&&(e.parentNode&&e.parentNode.replaceChild(i,e),m(e,!0))),i.__preactattr_=!0,i;var u=t.nodeName;if(\"function\"==typeof u)return N(e,t,n,o);if(R=\"svg\"===u||\"foreignObject\"!==u&&R,u+=\"\",(!e||!a(e,u))&&(i=p(u,R),e)){while(e.firstChild)i.appendChild(e.firstChild);e.parentNode&&e.parentNode.replaceChild(i,e),m(e,!0)}var c=i.firstChild,s=i.__preactattr_,_=t.children;if(null==s){s=i.__preactattr_={};for(var f=i.attributes,d=f.length;d--;)s[f[d].name]=f[d].value}return!B&&_&&1===_.length&&\"string\"==typeof _[0]&&null!=c&&void 0!==c.splitText&&null==c.nextSibling?c.nodeValue!=_[0]&&(c.nodeValue=_[0]):(_&&_.length||null!=c)&&v(i,_,n,o,B||null!=s.dangerouslySetInnerHTML),g(i,t.attributes,s),R=l,i}function v(e,t,n,o,r){var i,a,u,p,s,_=e.childNodes,f=[],d={},v=0,y=0,g=_.length,b=0,w=t?t.length:0;if(0!==g)for(var C=0;C<g;C++){var x=_[C],N=x.__preactattr_,k=w&&N?x._component?x._component.__k:N.key:null;null!=k?(v++,d[k]=x):(N||(void 0!==x.splitText?!r||x.nodeValue.trim():r))&&(f[b++]=x)}if(0!==w)for(var C=0;C<w;C++){p=t[C],s=null;var k=p.key;if(null!=k)v&&void 0!==d[k]&&(s=d[k],d[k]=void 0,v--);else if(y<b)for(i=y;i<b;i++)if(void 0!==f[i]&&l(a=f[i],p,r)){s=a,f[i]=void 0,i===b-1&&b--,i===y&&y++;break}s=h(s,p,n,o),u=_[C],s&&s!==e&&s!==u&&(null==u?e.appendChild(s):s===u.nextSibling?c(u):e.insertBefore(s,u))}if(v)for(var C in d)void 0!==d[C]&&m(d[C],!1);while(y<=b)void 0!==(s=f[b--])&&m(s,!1)}function m(e,t){var o=e._component;o?k(o):(null!=e.__preactattr_&&n(e.__preactattr_.ref,null),!1!==t&&null!=e.__preactattr_||c(e),y(e))}function y(e){e=e.lastChild;while(e){var t=e.previousSibling;m(e,!0),e=t}}function g(e,t,n){var o;for(o in n)t&&null!=t[o]||null==n[o]||s(e,o,n[o],n[o]=void 0,R);for(o in t)\"children\"===o||\"innerHTML\"===o||o in n&&t[o]===(\"value\"===o||\"checked\"===o?e[o]:n[o])||s(e,o,n[o],n[o]=t[o],R)}function b(e,t,n){var o,r=F.length;e.prototype&&e.prototype.render?(o=new e(t,n),U.call(o,t,n)):(o=new U(t,n),o.constructor=e,o.render=w);while(r--)if(F[r].constructor===e)return o.__b=F[r].__b,F.splice(r,1),o;return o}function w(e,t,n){return this.constructor(e,n)}function C(e,t,o,i,l){e.__x||(e.__x=!0,e.__r=t.ref,e.__k=t.key,delete t.ref,delete t.key,void 0===e.constructor.getDerivedStateFromProps&&(!e.base||l?e.componentWillMount&&e.componentWillMount():e.componentWillReceiveProps&&e.componentWillReceiveProps(t,i)),i&&i!==e.context&&(e.__c||(e.__c=e.context),e.context=i),e.__p||(e.__p=e.props),e.props=t,e.__x=!1,0!==o&&(1!==o&&!1===M.syncComponentUpdates&&e.base?r(e):x(e,1,l)),n(e.__r,e))}function x(e,n,o,r){if(!e.__x){var i,l,a,p=e.props,c=e.state,s=e.context,_=e.__p||p,h=e.__s||c,v=e.__c||s,y=e.base,g=e.__b,w=y||g,N=e._component,U=!1,S=v;if(e.constructor.getDerivedStateFromProps&&(c=t(t({},c),e.constructor.getDerivedStateFromProps(p,c)),e.state=c),y&&(e.props=_,e.state=h,e.context=v,2!==n&&e.shouldComponentUpdate&&!1===e.shouldComponentUpdate(p,c,s)?U=!0:e.componentWillUpdate&&e.componentWillUpdate(p,c,s),e.props=p,e.state=c,e.context=s),e.__p=e.__s=e.__c=e.__b=null,e.__d=!1,!U){i=e.render(p,c,s),e.getChildContext&&(s=t(t({},s),e.getChildContext())),y&&e.getSnapshotBeforeUpdate&&(S=e.getSnapshotBeforeUpdate(_,h));var L,T,P=i&&i.nodeName;if(\"function\"==typeof P){var A=u(i);l=N,l&&l.constructor===P&&A.key==l.__k?C(l,A,1,s,!1):(L=l,e._component=l=b(P,A,s),l.__b=l.__b||g,l.__u=e,C(l,A,0,s,!1),x(l,1,o,!0)),T=l.base}else a=w,L=N,L&&(a=e._component=null),(w||1===n)&&(a&&(a._component=null),T=d(a,i,s,o||!y,w&&w.parentNode,!0));if(w&&T!==w&&l!==N){var W=w.parentNode;W&&T!==W&&(W.replaceChild(T,w),L||(w._component=null,m(w,!1)))}if(L&&k(L),e.base=T,T&&!r){var D=e,E=e;while(E=E.__u)(D=E).base=T;T._component=D,T._componentConstructor=D.constructor}}!y||o?V.push(e):U||(e.componentDidUpdate&&e.componentDidUpdate(_,h,S),M.afterUpdate&&M.afterUpdate(e));while(e.__h.length)e.__h.pop().call(e);H||r||f()}}function N(e,t,n,o){var r=e&&e._component,i=r,l=e,a=r&&e._componentConstructor===t.nodeName,p=a,c=u(t);while(r&&!p&&(r=r.__u))p=r.constructor===t.nodeName;return r&&p&&(!o||r._component)?(C(r,c,3,n,o),e=r.base):(i&&!a&&(k(i),e=l=null),r=b(t.nodeName,c,n),e&&!r.__b&&(r.__b=e,l=null),C(r,c,1,n,o),e=r.base,l&&e!==l&&(l._component=null,m(l,!1))),e}function k(e){M.beforeUnmount&&M.beforeUnmount(e);var t=e.base;e.__x=!0,e.componentWillUnmount&&e.componentWillUnmount(),e.base=null;var o=e._component;o?k(o):t&&(null!=t.__preactattr_&&n(t.__preactattr_.ref,null),e.__b=t,c(t),F.push(e),y(t)),n(e.__r,null)}function U(e,t){this.__d=!0,this.context=t,this.props=e,this.state=this.state||{},this.__h=[]}function S(e,t,n){return d(n,e,{},!1,t,!1)}function L(){return{}}var T=function(){},M={},P=[],A=[],W=\"function\"==typeof Promise?Promise.resolve().then.bind(Promise.resolve()):setTimeout,D=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,E=[],V=[],H=0,R=!1,B=!1,F=[];t(U.prototype,{setState:function(e,n){this.__s||(this.__s=this.state),this.state=t(t({},this.state),\"function\"==typeof e?e(this.state,this.props):e),n&&this.__h.push(n),r(this)},forceUpdate:function(e){e&&this.__h.push(e),x(this,2)},render:function(){}});var j={h:e,createElement:e,cloneElement:o,createRef:L,Component:U,render:S,rerender:i,options:M};\"undefined\"!=typeof module?module.exports=j:window.preact=j}();";
// ShadowFunction
var ShadowPreact = /** @class */function () {
    function ShadowPreact(script) {
        // @ts-ignore
        return new index_1.ShadowDocument(document.body, '<div id="app"></div>')(PREACR)().run(script);
    }
    return ShadowPreact;
}();
exports.ShadowPreact = ShadowPreact;

/***/ }),

/***/ "./src/strongbox/index.ts":
/*!********************************!*\
  !*** ./src/strongbox/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ../freeze/index */ "./src/freeze/index.ts");
var LOCKABLE = true;
var Strongbox = /** @class */function () {
    function Strongbox(insurance) {
        this.password = this.randPassword();
        var secretKey = this.password;
        if (!LOCKABLE) throw new Error('Uncaught SyntaxError: Identifier \'Strongbox\' has already been declared');
        // important
        LOCKABLE = false;
        var _loop_1 = function (insured) {
            var object = insured[0];
            var props = insured[1];
            var value = object[props];
            Object.defineProperty(object, props, {
                get: function () {
                    return function (password, setValue) {
                        if (password === secretKey) {
                            if (setValue) {
                                value = setValue;
                            } else {
                                return value;
                            }
                        } else {
                            return;
                        }
                    };
                },
                set: function () {
                    return;
                },
                enumerable: true,
                configurable: false
            });
            index_1.freeze(object, true);
        };
        for (var _i = 0, insurance_1 = insurance; _i < insurance_1.length; _i++) {
            var insured = insurance_1[_i];
            _loop_1(insured);
        }
        return this;
    }
    Strongbox.prototype.randPassword = function () {
        var text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890', '~!@#$%^&*()_+";",./?<>'];
        var rand = function (min, max) {
            return Math.floor(Math.max(min, Math.random() * (max + 1)));
        };
        var len = rand(8, 16);
        var pw = '';
        for (var i = 0; i < len; ++i) {
            var strpos = rand(0, 3);
            pw += text[strpos].charAt(rand(0, text[strpos].length));
        }
        return pw;
    };
    return Strongbox;
}();
exports.Strongbox = Strongbox;

/***/ }),

/***/ "./src/try-again/index.ts":
/*!********************************!*\
  !*** ./src/try-again/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var TryAgain = /** @class */function () {
    function TryAgain(task, options) {
        this.task = task;
        this.polls = options.polls || 2;
        this.timeout = options.timeout || 3000;
        this.timeoutId = null;
    }
    TryAgain.prototype.try = function () {
        var _this = this;
        if (this.polls <= 0) return false;
        this.timeoutId = setTimeout(function () {
            if (_this.polls-- > 0) _this.task() && _this.try();
        }, this.timeout);
    };
    TryAgain.prototype.stop = function () {
        clearTimeout(this.timeoutId);
    };
    TryAgain.prototype.wait = function (time) {
        this.timeout = time;
    };
    TryAgain.prototype.over = function () {
        this.stop();
        this.polls = 0;
    };
    return TryAgain;
}();
exports.TryAgain = TryAgain;

/***/ }),

/***/ "./src/url/index.ts":
/*!**************************!*\
  !*** ./src/url/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var object2params = function (obj) {
    var url = '';
    Object.entries(obj).forEach(function (v) {
        if (typeof v[1] === 'object') v[1] = JSON.stringify(v[1]);
        url += v.join('=') + '&';
    });
    return url.substring(0, url.length - 1);
};
exports.object2params = object2params;

/***/ }),

/***/ "./src/workerFunction/index.ts":
/*!*************************************!*\
  !*** ./src/workerFunction/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var WorkerFunction = /** @class */function () {
    function WorkerFunction(code) {
        code = typeof code === 'string' ? code : typeof code === 'function' ? Object.toString.call(code) : '';
        // code = `self.addEventListener('message', function (event) { ` + code + ` }, false)`
        return new Worker(URL.createObjectURL(new Blob([code])));
    }
    return WorkerFunction;
}();
exports.WorkerFunction = WorkerFunction;

/***/ })

/******/ });
//# sourceMappingURL=test.dev.js.map