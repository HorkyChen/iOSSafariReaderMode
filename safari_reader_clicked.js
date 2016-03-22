/*Generated from LLDB dump.*/
@Horky.Chen, 2013 * /
/ * * Copyright©2010 Apple Inc.All rights reserved. * /

String.prototype.format=function()
{var stringParts=this.split("%@");for(var i=0;i<arguments.length;++i)
stringParts.splice(i*2+1,0,arguments[i].toString());return stringParts.join("");}
const DefaultTextZoomIndex=3;const FontSettings={"Baskerville":{"fontSizes":[16,17,18,21,23,26,28,31,41,53],"lineHeights":[1.21,1.21,1.21,1.21,1.21,1.21,1.21,1.21,1.21,1.21]},"Cochin":{"fontSizes":[17,18,20,22,25,28,30,33,44,57],"lineHeights":[1.23,1.23,1.24,1.23,1.23,1.23,1.23,1.23,1.23,1.23]},"Georgia":{"fontSizes":[15,16,19,20,22,23,26,28,37,46],"lineHeights":[1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34]},"Palatino":{"fontSizes":[14,16,18,19,21,22,24,26,37,45,98],"lineHeights":[1.4,1.4,1.4,1.4,1.4,1.4,1.4,1.4,1.4,1.4,1.4]},"Times New Roman":{"fontSizes":[15,16,19,20,22,23,26,28,37,46],"lineHeights":[1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34,1.34]},"Verdana":{"fontSizes":[11,13,14,16,17,19,21,23,32,39],"lineHeights":[1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6]}};const LoadNextPageDelay=250;const MaxNumberOfNextPagesToLoad=40;var ReaderOperationMode={Normal:0,OffscreenFetching:1,ArchiveViewing:2,};AppleAnimator=function(duration,interval,optionalFrom,optionalTo,optionalCallback)
{this.startTime=0;this.duration=duration;this.interval=interval;this.animations=new Array;this.timer=null;this.oncomplete=null;this._firstTime=true;var self=this;this.animate=function(self){function limit_3(a,b,c){return a<b?b:(a>c?c:a);}
var T,time;var ease;var time=(new Date).getTime();var dur=self.duration;var done;T=limit_3(time-self.startTime,0,dur);time=T/dur;
ease = 0.5 - (0.5 * Math.cos(Math.PI * time));
done = T >= dur;
var array = self.animations;
var c = array.length;
var first = self._firstTime;
for (var i = 0; i < c; ++i) {
    array[i].doFrame(self, ease, first, done, time);
}
if (done) {
    self.stop();
    if (self.oncomplete != null) {
        self.oncomplete();
    }
}
self._firstTime = false;
}
if (optionalFrom !== undefined && optionalTo !== undefined && optionalCallback !== undefined) {
    this.addAnimation(new AppleAnimation(optionalFrom, optionalTo, optionalCallback));
}
}
AppleAnimator.prototype = {
    start: function start(optionalStartTimeOffset) {
        if (this.timer == null) {
            var timeNow = (new Date).getTime();
            var interval = this.interval;
            this.startTime = timeNow - interval;
            if (optionalStartTimeOffset) this.startTime += optionalStartTimeOffset;
            this.timer = setInterval(this.animate, interval, this);
        }
    },
    stop: function stop() {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    addAnimation: function addAnimation(animation) {
        this.animations[this.animations.length] = animation;
    }
}
AppleAnimation = function (from, to, callback) {
    this.from = from;
    this.to = to;
    this.callback = callback;
    this.now = from;
    this.ease = 0;
    this.progress = 0;
}
AppleAnimation.prototype = {
    doFrame: function doFrame(animation, ease, first, done, progress) {
        var now;
        if (done) now = this.to;
        else now = this.from + (this.to - this.from) * ease;
        this.now = now;
        this.ease = ease;
        this.progress = progress;
        this.callback(animation, now, first, done);
    }
}

function removeStyleClass(element, className) {
    if (element.className === className) {
        element.className = "";
        return;
    }
    var index = element.className.indexOf(className);
    if (index === -1) return;
    var newClassName = " " + element.className + " ";
    element.className = newClassName.replace(" " + className + " ", " ");
}

function removeMatchingStyleClasses(element, classNameRegex) {
    var regex = new RegExp("(^|\\s+)" + classNameRegex + "($|\\s+)");
    if (regex.test(element.className)) element.className = element.className.replace(regex, " ");
}

function addStyleClass(element, className) {
    if (className && !hasStyleClass(element, className)) element.className += (element.className.length ? " " + className : className);
}

function hasStyleClass(element, className) {
    if (!className) return false;
    if (element.className === className) return true;
    var index = element.className.indexOf(className);
    if (index === -1) return false;
    var toTest = " " + element.className + " ";
    return toTest.indexOf(" " + className + " ", index) !== -1;
}
ReaderController = function () {
    this.pageNumber = 1;
    this.pageURLs = [];
    this.articleIsLTR = true;
    this.loadingNextPage = false;
    this.loadingNextPageManuallyStopped = false;
    this.cachedNextPageURL = null;
    this.cachedTopVisibleNode = null;
    this.cachedTopVisibleNodeOffset = 0;
}
ReaderController.prototype = {
    shouldAnimate: function shouldAnimate() {
        return this.readerOperationMode != ReaderOperationMode.OffscreenFetching;
    },
    shouldShowHUD: function shouldShowHUD() {
        return this.readerOperationMode != ReaderOperationMode.OffscreenFetching;
    },
    setOriginalURL: function setOriginalURLAndTitle(url) {
        this.originalURL = url;
        this.pageURLs.push(url);
        document.head.getElementsByTagName("base")[0].href = this.originalURL;
    },
    setNextPageURL: function setNextPageURL(url) {
        if (!url || this.pageURLs.indexOf(url) !== -1 || this.pageNumber + 1 === MaxNumberOfNextPagesToLoad) {
            this.setLoadingNextPage(false);
            return;
        }
        this.setLoadingNextPage(true);
        this.pageURLs.push(url);
        var loadNextURL = function () {
            nextPageContainer().addEventListener('load', nextPageLoadComplete, false);
            nextPageContainer().src = url;
        };
        if (this.readerOperationMode == ReaderOperationMode.OffscreenFetching) loadNextURL();
        else this.nextPageLoadTimer = setTimeout(loadNextURL, LoadNextPageDelay);
    },
    pauseLoadingNextPage: function pauseLoadingNextPage() {
        if (this.readerOperationMode != ReaderOperationMode.Normal) return;
        nextPageContainer().removeEventListener('load', nextPageLoadComplete, false);
        nextPageContainer().src = null;
        if (this.nextPageLoadTimer) clearTimeout(this.nextPageLoadTimer);
        ReaderJSController.didChangeNextPageLoadingState(false);
    },
    stopLoadingNextPage: function stopLoadingNextPage() {
        nextPageContainer().removeEventListener('load', nextPageLoadComplete, false);
        nextPageContainer().src = null;
        if (this.nextPageLoadTimer) clearTimeout(this.nextPageLoadTimer);
        this.setLoadingNextPage(false);
        this.loadingNextPageManuallyStopped = true;
    },
    isLoadingNextPage: function isLoadingNextPage() {
        return this.loadingNextPage;
    },
    setLoadingNextPage: function setLoadingNextPage(newValue) {
        if (this.loadingNextPage == newValue) return;
        if (newValue) addIncomingPagePlaceholder(ReaderJSController.canLoadFromNetwork());
        else removeIncomingPagePlaceholder();
        this.loadingNextPage = newValue;
        ReaderJSController.didChangeNextPageLoadingState(this.loadingNextPage);
    },
    doneLoadingAllPages: function doneLoadingAllPages() {
        if (this.readerOperationMode == ReaderOperationMode.OffscreenFetching) resetForPotentialReactivation();
        ReaderJSController.didFinishLoadingReaderPage();
    },
    loaded: function loaded() {
        initializeWithSavedTextZoomIndex();
        initializeMaxDistanceForLoadingNextPage();
        this.readerOperationMode = ReaderJSController.readerOperationMode();
        ReaderJSController.loaded();
        ReaderJSController.setIsDisconnectedFrame("next-page-container");
        document.getElementById("background").addEventListener('webkitTransitionEnd', backgroundTransitionDidFinish, false);
        if (!ReaderJSController.originalArticleFinder() && !ReaderJSController.isLoadingFromOfflineReadingListArchive()) {
            ReaderJSController.deactivateNow();
            return;
        }
        this.loadArticle();
        activateWithAnimation(this.shouldAnimate());
        var scrollTop = ReaderJSController.cachedTopScrollOffset();
        if (scrollTop > 0) document.body.scrollTop = scrollTop;
        else {
            var element = document.getElementById("safari-reader-element-marker");
            if (element) {
                var offset = parseFloat(element.style.top) / 100;
                var parent = element.parentElement;
                var rect = parent.getBoundingClientRect();
                document.body.scrollTop = window.scrollY + rect.top + rect.height * offset;
                parent.removeChild(element);
            }
        }
    },
    loadArticle: function loadArticle() {
        var articleFinder = ReaderJSController.originalArticleFinder();
        this.routeToArticle = articleFinder.routeToArticleNode();
        this.displayTitle = articleFinder.articleTitle();
        this.articleIsLTR = articleFinder.articleIsLTR();
        var originalDocument = articleFinder.adoptableArticle().ownerDocument;
        document.title = originalDocument.title;
        this.setOriginalURL(originalDocument.baseURI);
        if (this.readerOperationMode == ReaderOperationMode.ArchiveViewing) {
            updateFonts();
            return;
        }
        this.setNextPageURL(articleFinder.nextPageURL());
        var adoptableArticle = articleFinder.adoptableArticle();
        this.updateHypenationLocaleFromElement(adoptableArticle);
        this.createPageFromNode(adoptableArticle);
        if (!this.isLoadingNextPage()) this.doneLoadingAllPages();
    },
    loadNewArticle: function loadNewArticle() {
        if (!ReaderJSController.originalArticleFinder()) {
            ReaderJSController.deactivateNow();
            return;
        }
        var articleNode = document.getElementById("article");
        while (articleNode.childNodes.length >= 1)
        articleNode.removeChild(articleNode.firstChild);
        this.reinitialize();
        articleNode.scrollTop = 0;
        this.loadArticle();
    },
    reinitialize: function reinitialize() {
        this.pageNumber = 1;
        this.pageURLs = [];
        this.articleIsLTR = true;
        this.loadingNextPage = false;
        this.loadingNextPageManuallyStopped = false;
        this.routeToArticle = undefined;
        this.displayTitle = undefined;
        this.originalURL = undefined;
        this.nextPageLoadTimer = undefined;
        this.readerOperationMode = ReaderJSController.readerOperationMode();
        this.cachedNextPageURL = null;
        this.cachedTopVisibleNode = null;
        this.cachedTopVisibleNodeOffset = 0;
    },
    createPageFromNode: function createPageFromNode(contentNode) {
        var pageNode = document.createElement("div");
        pageNode.className = "page";
        if (!this.articleIsLTR) addStyleClass(pageNode, "rtl");
        var pageNumberNode = document.createElement("div");
        pageNumberNode.className = "page-number";
        pageNode.appendChild(pageNumberNode);
        var titleNode = document.createElement("h1");
        titleNode.className = "title";
        titleNode.textContent = this.displayTitle;
        pageNode.appendChild(titleNode);
        while (contentNode.firstChild)
        pageNode.appendChild(contentNode.firstChild);
        var shouldAnimatePageHeight = ReaderJS.pageNumber > 1;
        shouldAnimatePageHeight = false;
        if (shouldAnimatePageHeight) {
            pageNode.style.height = "115px";
        }
        var container = document.getElementById("article");
        container.insertBefore(pageNode, incomingPagePlaceholder());
        updateFonts();
        if (shouldAnimatePageHeight) {
            pageNode.style.height = pageNode.scrollHeight + "px";

            function resetHeightAfterTransition(event) {
                addStyleClass(pageNode, "no-transition");
                pageNode.style.height = "auto";
                setTimeout(function () {
                    removeStyleClass(pageNode, "no-transition")
                }, 0);
            }
            pageNode.addEventListener('webkitTransitionEnd', resetHeightAfterTransition, false);
        }
        updatePageNumbers();
        updateArticlePaddingAndShadows();
        restoreInitialArticleScrollPositionIfPossible();
    },
    removeAttribute: function removeAttribute(node, attribute) {
        var nodesWithAttribute = node.querySelectorAll("[" + attribute + "]");
        var length = nodesWithAttribute.length;
        for (var i = 0; i < length; i++)
        nodesWithAttribute[i].removeAttribute(attribute);
    },
    preparePrintingMailingFrame: function preparePrintingMailingFrame() {
        var frameId = this.printingMailingFrameElementId();
        var frame = document.getElementById(frameId);
        if (frame) document.body.removeChild(frame);
        frame = document.createElement("iframe");
        frame.id = frameId;
        frame.style.display = "none";
        frame.style.position = "absolute";
        document.body.appendChild(frame);
        var frameDocument = frame.contentDocument;
        var baseURL = document.createElement("base");
        baseURL.href = this.originalURL;
        frameDocument.head.appendChild(baseURL);
        var urlContainer = document.createElement("div");
        urlContainer.className = "original-url";
        var urlNode = document.createElement("a");
        urlNode.href = this.originalURL;
        urlNode.textContent = this.originalURL;
        urlContainer.appendChild(urlNode);
        urlContainer.appendChild(document.createElement("br"));
        urlContainer.appendChild(document.createElement("br"));
        frameDocument.body.appendChild(urlContainer);
        var clonedArticle = document.getElementById("article").cloneNode(true);
        var clonedStyle = document.getElementById("article-content").cloneNode(true);
        frameDocument.body.appendChild(clonedArticle);
        frameDocument.head.appendChild(clonedStyle);
        var title = frameDocument.createElement("title");
        title.innerText = document.title;
        frameDocument.head.appendChild(title);
        clonedArticle.removeAttribute("tabindex");
        var titlesToRemove = clonedArticle.querySelectorAll(".title");
        for (var i = 1; i < titlesToRemove.length; i++)
        titlesToRemove[i].parentNode.removeChild(titlesToRemove[i]);
        var otherElementsToRemove = clonedArticle.querySelectorAll(".page-number, #incoming-page-placeholder");
        for (var i = 0; i < otherElementsToRemove.length; i++)
        otherElementsToRemove[i].parentNode.removeChild(otherElementsToRemove[i]);
        var lastPage = clonedArticle.querySelector(".page:last-of-type");
        if (lastPage) lastPage.style.removeProperty("padding-bottom");
        var elementsToCheck = clonedArticle.querySelectorAll('img, video, audio, source');
        const schemeRegex = /^http:\/\/|^https:\/\/|^data:/i;
        for (var i = 0; i < elementsToCheck.length; i++) {
            var clonedElement = elementsToCheck[i];
            var srcAttr = clonedElement.getAttribute("src");
            if (!schemeRegex.test(srcAttr)) clonedElement.setAttribute('src', clonedElement.src);
        }
    },
    printingMailingFrameElementId: function printingMailingFrameElementId() {
        return "printing-mailing-frame";
    },
    setShowsResizeIndicator: function setShowsResizeIndicator(show) {
        document.getElementById("resize-indicator").style.display = show ? "block" : "none";
    },
    updateHypenationLocaleFromElement: function updateHypenationLocaleFromElement(element) {
        if (!ReaderJSController._isIPad) return;
        var bestLocale = ReaderJSController.bestLocaleForString(element.textContent);
        var articleElement = document.getElementById("article");
        if (bestLocale) {
            articleElement.style.webkitHyphens = "auto";
            articleElement.style.webkitLocale = "'" + bestLocale + "'";
        } else {
            articleElement.style.webkitHyphens = "manual";
            articleElement.style.webkitLocale = "";
        }
    },
    canLoadNextPage: function canLoadNextPage() {
        if (this.readerOperationMode != ReaderOperationMode.Normal) return true;
        var pages = document.querySelectorAll(".page");
        var lastPage = pages[pages.length - 1];
        var lastPageRect = lastPage.getBoundingClientRect();
        if (lastPageRect.bottom - window.scrollY > ReaderJSController._cachedMaxDistanceForLoadingNextPage) return false;
        else return true;
    },
    setCachedNextPageURL: function setCachedNextPageURL(url) {
        if (!url) {
            this.setNextPageURL(url);
        } else {
            this.cachedNextPageURL = url;
            ReaderJSController.didChangeNextPageLoadingState(false);
        }
    },
    loadNextPage: function loadNextPage() {
        if (this.cachedNextPageURL != null) {
            this.setNextPageURL(this.cachedNextPageURL);
            this.cachedNextPageURL = null;
            ReaderJSController.didChangeNextPageLoadingState(true);
        }
    },
    findTopVisibleNode: function findTopVisibleNode() {
        var node = document.elementFromPoint(160, 20);
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        this.cachedTopVisibleNode = node;
        var nodeRect = this.cachedTopVisibleNode.getBoundingClientRect();
        this.cachedTopVisibleNodeOffset = nodeRect.height > 0 ? nodeRect.top / nodeRect.height : 0;
    }
}
window.addEventListener("pageshow", pageShown, false);
window.addEventListener("resize", resize, false);
window.addEventListener("keydown", keyDown, false);

function pageShown(event) {}

function resize() {
    updateArticlePaddingAndShadows();
    revealCachedTopVisibleNode();
}

function updateArticlePaddingAndShadows() {
    var pages = document.querySelectorAll(".page");
    var dropShadow = document.getElementById("drop-shadow");
    if (!pages.length) {
        dropShadow.style.opacity = "0";
        return;
    }
    dropShadow.style.opacity = "1";
    const DefaultLastPageBottomPadding = 45;
    const FirstPageTopAfterTransition = 22;
    var lastPage = pages[pages.length - 1];
    var lastPageRect = lastPage.getBoundingClientRect();
    var lastPageTop = pages.length === 1 ? FirstPageTopAfterTransition : lastPageRect.top;
    var computedStyle = window.getComputedStyle(lastPage);
    var bottomPadding = parseInt(computedStyle["padding-bottom"]);
    var bottomMargin = parseInt(computedStyle["margin-bottom"]);
    var heightIgnoringBottomPadding = lastPageRect.height - bottomPadding;
    var bottomPaddingToFillWindow = window.innerHeight - lastPageTop - heightIgnoringBottomPadding - bottomMargin;
    var padding = Math.max(bottomPaddingToFillWindow, DefaultLastPageBottomPadding);
    lastPage.style.paddingBottom = padding + "px";
}

function updateFindInPageMarkers() {
    ReaderJSController.updateFindInPageMarkers();
}

function keyDown(event) {
    switch (event.keyCode) {
    case 8:
        if (event.shiftKey) ReaderJSController.goForward();
        else ReaderJSController.goBack();
        event.preventDefault();
        break;
    case 27:
        deactivateAfterAnimation();
        event.preventDefault();
        break;
    case 32:
        event.shiftKey ? smoothScrollByPages(-1) : smoothScrollByPages(1);
        event.preventDefault();
        break;
    case 33:
        smoothScrollByPages(-1);
        event.preventDefault();
        break;
    case 34:
        smoothScrollByPages(1);
        event.preventDefault();
        break;
    case 35:
        smoothScrollToDocumentEnd();
        event.preventDefault();
        break;
    case 36:
        smoothScrollToDocumentStart();
        event.preventDefault();
        break;
    case 38:
        if (event.metaKey) smoothScrollToDocumentStart();
        else if (event.ctrlKey) smoothScrollByPages(-1);
        else smoothScrollByLines(-1);
        event.preventDefault();
        break;
    case 40:
        if (event.metaKey) smoothScrollToDocumentEnd();
        else if (event.ctrlKey) smoothScrollByPages(1);
        else smoothScrollByLines(1);
        event.preventDefault();
        break;
    }
}
const PageScrollDuration = 800;
const LineScrollDuration = 150;
const LineScrollHeight = 50;
const DelayBeforeRestoringScrollPositionInMs = 1000;
var scrollEventIsSmoothScroll = false;
var smoothScrollingAnimator;
var smoothScrollingAnimation;
var didRestoreInitialScrollPosition = false;
var initialScrollPosition;

function smoothScrollToDocumentStart() {
    var article = document.getElementById("article");
    var distance = Math.min(-article.scrollTop, LineScrollHeight - article.clientHeight);
    smoothScroll(article, distance, PageScrollDuration);
}

function smoothScrollToDocumentEnd() {
    var article = document.getElementById("article");
    var distance = Math.max(article.scrollHeight - article.clientHeight - article.scrollTop, article.clientHeight - LineScrollHeight);
    smoothScroll(article, distance, PageScrollDuration);
}

function smoothScrollByPages(numPages) {
    var article = document.getElementById("article");
    var distance = (article.clientHeight - LineScrollHeight) * numPages;
    smoothScroll(article, distance, PageScrollDuration);
}

function smoothScrollByLines(numLines) {
    var article = document.getElementById("article");
    smoothScroll(article, LineScrollHeight * numLines, LineScrollDuration);
}

function smoothScroll(element, offset, duration, callback) {
    const intervalDuration = (1000 / 60);
    var startValue = element.scrollTop;
    var endValue = startValue + offset;
    var minimumScrollTop = 0;
    var maximumScrollTop = element.scrollHeight - element.clientHeight;
    if (endValue < minimumScrollTop) endValue = minimumScrollTop;
    if (endValue > maximumScrollTop) endValue = maximumScrollTop;
    if (startValue == endValue) return;
    if (!ReaderJSController.useSmoothScrolling()) duration = 0;
    if (duration === 0) {
        element.scrollTop = endValue;
        return;
    }
    var deltaToScroll = Math.abs(endValue - startValue);
    if (deltaToScroll < Math.abs(offset)) {
        duration = duration * deltaToScroll / Math.abs(offset);
    }

    function animationHandler(currentAnimator, current, start, finish) {
        scrollEventIsSmoothScroll = true;
        element.scrollTop = current;
        setTimeout(function () {
            scrollEventIsSmoothScroll = false;
        }, 0);
    }
    if (smoothScrollingAnimator) {
        var animation = smoothScrollingAnimator.animations[0];
        var currentProgress = animation.progress;
        var newProgress = (currentProgress > 0.5) ? (1 - currentProgress) : currentProgress;
        var newDuration = duration / (1 - newProgress);
        var startTimeOffset = -newProgress * newDuration;
        var deltaValue = endValue - startValue;
        var currentSpeed = deltaValue * 0.5 * Math.PI * Math.sin(Math.PI * currentProgress);
        var sine = Math.sin(Math.PI / 2 * newProgress);
        var sineSquared = sine * sine;
        var newStartValue = (startValue - endValue * sineSquared) / (1 - sineSquared);
        abortSmoothScroll();
        smoothScrollingAnimator = new AppleAnimator(newDuration, intervalDuration);
        smoothScrollingAnimation = new AppleAnimation(newStartValue, endValue, animationHandler);
        smoothScrollingAnimator.addAnimation(smoothScrollingAnimation)
        smoothScrollingAnimator.start(startTimeOffset);
        return;
    }
    smoothScrollingAnimator = new AppleAnimator(duration, intervalDuration);
    smoothScrollingAnimation = new AppleAnimation(startValue, endValue, animationHandler);
    smoothScrollingAnimator.addAnimation(smoothScrollingAnimation)
    smoothScrollingAnimator.start();
}

function abortSmoothScroll() {
    smoothScrollingAnimator.stop();
    smoothScrollingAnimator = null;
    smoothScrollingAnimation = null;
}

function articleScrolled() {
    updateFindInPageMarkers();
    if (!scrollEventIsSmoothScroll && smoothScrollingAnimator) abortSmoothScroll();
    updateArticlePaddingAndShadows();
}

function preloadImages() {
    var imageURLs = ["safari-resource:/ReaderHUDCloseActive.png", "safari-resource:/ReaderHUDMailContentsActive.png", "safari-resource:/ReaderHUDPrintActive.png", "safari-resource:/ReaderHUDZoomInActive.png", "safari-resource:/ReaderHUDZoomOutActive.png"];
    for (i = 0; i < imageURLs.length; i++) {
        var image = new Image();
        image.src = imageURLs[i];
    }
}

function backgroundTransitionDidFinish(event) {
    if (isActivating()) {
        removeStyleClass(document.body, "preloading");
        removeStyleClass(document.body, "activating");
        document.getElementById("article").focus();
        hudMouseOver();
        setTimeout(hudMouseOut, 1000);
        return;
    }
    if (isDeactivating()) {
        ReaderJSController.deactivateNow();
        return;
    }
}

function setHUDAcceptsPointerEvents(acceptEvents) {
    document.getElementById("hud").style.pointerEvents = acceptEvents ? "auto" : "none";
}

function setHUDVisible(visible) {
    if (!visible && ReaderJSController.isAccessibilityEnabled()) return;
    var hudElement = document.getElementById("hud");
    hudElement.style.opacity = visible ? 1 : 0;
    var hudButtons = hudElement.querySelectorAll("button")
    for (var i = 0; i < hudButtons.length; i++) {
        if (visible) hudButtons[i].removeAttribute("disabled");
        else hudButtons[i].setAttribute("disabled", "true");
    }
}

function hudMouseOver(event) {
    if (event) this.hudHovered = true;
    clearTimeout(this.hudFadeOutTimer);
    setHUDVisible(true);
}

function hudMouseOut(event) {
    if (event) this.hudHovered = false;
    if (this.hudHovered) return;
    var fadeOutFunction = function () {
        setHUDVisible(false);
    }
    clearTimeout(this.hudFadeOutTimer);
    this.hudFadeOutTimer = setTimeout(fadeOutFunction, 1000);
}

function didLoseFocus(event) {
    hudMouseOut();
}

function canMakeTextLarger() {
    if (ReaderJSController._isIPad) return currentTextZoomIndex() < fontSettings()["fontSizes"].length - 1;
    else return currentTextZoomIndex() < fontSettings()["fontSizes"].length - 2;
}

function makeTextLarger() {
    if (canMakeTextLarger()) setCurrentTextZoomIndex(currentTextZoomIndex() + 1);
    updateFonts();
    updateArticlePaddingAndShadows();
    updateFindInPageMarkers();
}

function canMakeTextSmaller() {
    return currentTextZoomIndex() > 0;
}

function makeTextSmaller() {
    if (canMakeTextSmaller()) setCurrentTextZoomIndex(currentTextZoomIndex() - 1);
    updateFonts();
    updateArticlePaddingAndShadows();
    updateFindInPageMarkers();
}

function canMakeTextStandardSize() {
    return DefaultTextZoomIndex != currentTextZoomIndex();
}

function makeTextStandardSize() {
    setCurrentTextZoomIndex(DefaultTextZoomIndex);
    localStorage.removeItem("textZoomIndex");
    updateFonts();
    updateArticlePaddingAndShadows();
    updateFindInPageMarkers();
}

function updateFonts() {
    var fontSize = currentTextFontSize() + "px";
    var lineHeight = currentTextLineHeight();
    var pages = document.getElementsByClassName("page");
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.fontFamily = fontName() + ", Georgia, Times, \"Times New Roman\", serif";
        pages[i].style.fontSize = fontSize;
        pages[i].style.lineHeight = lineHeight;
    }
    adjustWideTablesAndPlugins();
    revealCachedTopVisibleNode();
}

function initializeWithSavedTextZoomIndex() {
    this.textZoomIndex = parseInt(localStorage.textZoomIndex);
    if (isNaN(this.textZoomIndex)) this.textZoomIndex = DefaultTextZoomIndex;
    return this.textZoomIndex;
}

function currentTextZoomIndex() {
    return this.textZoomIndex;
}

function setCurrentTextZoomIndex(newIndex) {
    this.textZoomIndex = newIndex;
    localStorage.textZoomIndex = newIndex;
}

function currentTextFontSize() {
    return fontSettings()["fontSizes"][currentTextZoomIndex()];
}

function currentTextLineHeight() {
    return fontSettings()["lineHeights"][currentTextZoomIndex()];
}

function fontName() {
    var fontName = localStorage.fontName;
    if (!fontName || !FontSettings[fontName]) fontName = "Palatino";
    return fontName;
}

function fontSettings() {
    return FontSettings[fontName()];
}

function mailArticle() {
    ReaderJSController.mailArticle();
}

function printArticle() {
    ReaderJSController.printArticle();
}

function getArticleScrollPosition() {
    scrollInfo = new Object();
    scrollInfo.version = 1;
    var pages = document.getElementsByClassName("page");
    if (!pages.length) {
        scrollInfo.pageIndex = 0;
        return scrollInfo;
    }
    scrollInfo.pageIndex = pages.length - 1;
    var windowScrollOffset = window.scrollY;
    var pageIndex;
    for (pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        var page = pages[pageIndex];
        if ((page.offsetTop + page.offsetHeight) >= windowScrollOffset) {
            scrollInfo.pageIndex = pageIndex;
            break;
        }
    }
    return scrollInfo;
}

function restoreInitialArticleScrollPosition() {
    var pages = document.getElementsByClassName("page");
    var page = pages[initialScrollPosition.pageIndex];
    if (page == undefined) return;
    var article = document.getElementById("article");
    var distance = page.offsetTop - article.scrollTop;
    smoothScroll(article, distance, PageScrollDuration);
}

function restoreInitialArticleScrollPositionIfPossible() {
    if (didRestoreInitialScrollPosition) return;
    if (initialScrollPosition == undefined) {
        initialScrollPosition = ReaderJSController.initialArticleScrollPosition();
        if ((initialScrollPosition == undefined) || (initialScrollPosition.pageIndex == undefined)) {
            didRestoreInitialScrollPosition = true;
            return;
        }
    }
    var lastGeneratedPageIndex = document.getElementsByClassName("page-number").length;
    if (initialScrollPosition.pageIndex >= lastGeneratedPageIndex) {
        return;
    }
    setTimeout("restoreInitialArticleScrollPosition()", DelayBeforeRestoringScrollPositionInMs);
    didRestoreInitialScrollPosition = true;
}

function updatePageNumbers() {
    var pageNumberLabels = document.getElementsByClassName("page-number");
    var numberOfPages = pageNumberLabels.length;
    for (var i = 0; i < numberOfPages; i++) {
        if (ReaderJS.isLoadingNextPage()) pageNumberLabels[i].textContent = getLocalizedString("Page %@").format(i + 1);
        else pageNumberLabels[i].textContent = getLocalizedString("Page %@ of %@").format(i + 1, numberOfPages);
    }
}

function incomingPagePlaceholder() {
    return document.getElementById("incoming-page-placeholder");
}

function addIncomingPagePlaceholder(canLoadFromNetwork) {
    var placeholderPage = document.createElement("div");
    placeholderPage.className = "page";
    placeholderPage.id = "incoming-page-placeholder";
    var container = document.createElement("div");
    container.id = "incoming-page-corner";
    if (canLoadFromNetwork) {
        var text = document.createElement("div");
        text.id = "incoming-page-text";
        text.innerText = getLocalizedString("Loading Next Page...");
        container.appendChild(text);
        var spinner = document.createElement("div");
        spinner.id = "incoming-page-spinner";
        spinner.className = "animation-discrete-spinner";
        container.appendChild(spinner);
    } else {
        var text = document.createElement("div");
        text.id = "incoming-page-text";
        text.innerText = getLocalizedString("Connect to the Internet to view remaining pages.");
        container.appendChild(text);
    }
    placeholderPage.appendChild(container);
    document.getElementById("article").appendChild(placeholderPage);
}

function removeIncomingPagePlaceholder() {
    var placeholder = incomingPagePlaceholder();
    placeholder.parentNode.removeChild(placeholder);
}

function isActivating() {
    return hasStyleClass(document.body, "activating");
}

function isDeactivating() {
    return hasStyleClass(document.body, "deactivating")
}

function nextPageLoadComplete() {
    nextPageContainer().removeEventListener('load', nextPageLoadComplete, false);
    ReaderJS.pageNumber++;
    if (ReaderJS.readerOperationMode == ReaderOperationMode.OffscreenFetching) ReaderJSController.nextPageLoadComplete(ReaderJS.pageNumber, "next-page-container");
    if (isDeactivating()) return;
    ReaderJSController.prepareNextPageFrame("next-page-container");
    var articleFinder = ReaderJSController.nextPageArticleFinder();
    articleFinder.pageNumber = ReaderJS.pageNumber;
    articleFinder.suggestedRouteToArticle = ReaderJS.routeToArticle;
    var articleElement = articleFinder.adoptableArticle();
    if (articleElement) {
        ReaderJS.createPageFromNode(articleElement);
        ReaderJS.routeToArticle = articleFinder.routeToArticleNode();
    }
    nextPageContainer().removeAttribute("src");
    ReaderJSController.clearNextPageArticleFinder();
    if (ReaderJS.canLoadNextPage()) ReaderJS.setNextPageURL(articleFinder.nextPageURL());
    else ReaderJS.setCachedNextPageURL(articleFinder.nextPageURL());
    updatePageNumbers();
    restoreInitialArticleScrollPositionIfPossible();
    if (!ReaderJS.isLoadingNextPage()) ReaderJS.doneLoadingAllPages();
}

function nextPageContainer() {
    return document.getElementById("next-page-container");
}

function getLocalizedString(string) {
    var localizedString = localizedStrings[string];
    if (localizedString) return localizedString;
    return string;
}

function activateWithAnimation(animate) {
    if (!animate) {
        addStyleClass(document.body, "skip-transition");

        function removeTransitionStyle() {
            removeStyleClass(document.body, "skip-transition");
            removeStyleClass(document.body, "preloading");
            removeStyleClass(document.body, "activating");
        }
        setTimeout(removeTransitionStyle, 0);
    }
    addStyleClass(document.body, "activating");
    removeStyleClass(document.body, "cached");
    if (ReaderJS.cachedNextPageURL && ReaderJS.canLoadNextPage()) ReaderJS.loadNextPage();
}

function deactivateAfterAnimation() {
    if (ReaderJS.isLoadingNextPage()) ReaderJS.stopLoadingNextPage();
    if (isActivating()) {
        ReaderJSController.deactivateNow();
        return;
    }
    if (isDeactivating()) return;
    addStyleClass(document.body, "deactivating");
}

function resetForPotentialReactivation() {
    removeStyleClass(document.body, "activating");
    removeStyleClass(document.body, "deactivating");
    addStyleClass(document.body, "preloading");
    if (ReaderJS.isLoadingNextPage() || ReaderJS.loadingNextPageManuallyStopped) {
        if (!ReaderJS.cachedNextPageURL) {
            ReaderJS.cachedNextPageURL = ReaderJS.pageURLs.pop();
        }
        ReaderJS.pauseLoadingNextPage();
    }
    var audioAndVideoElements = document.querySelectorAll("audio, video");
    for (var i = 0; i < audioAndVideoElements.length; i++)
    audioAndVideoElements[i].pause();
    addStyleClass(document.body, "cached");
    return true;
}

function hasMultiplePages() {
    var pages = document.querySelectorAll(".page");
    return pages.length > 1;
}

function adjustWideTablesAndPlugins() {
    const PageHorizontalPadding = 36;
    var tables = document.getElementsByTagName("TABLE");
    var articleWidth = document.getElementById("article").getBoundingClientRect().width;
    for (var i = 0; i < tables.length; i++) {
        var tableWidth = tables[i].getBoundingClientRect().width;
        if (tableWidth > articleWidth - PageHorizontalPadding) {
            var table = tables[i];
            if (hasStyleClass(table.parentElement, "reader-scrollable-div")) continue;
            var div = document.createElement("DIV");
            div.style.width = "100%";
            div.style.height = table.getBoundingClientRect().height;
            addStyleClass(div, "reader-scrollable-div");
            table.parentElement.replaceChild(div, table);
            div.appendChild(table);
        }
    }
    var plugins = document.plugins;
    for (var i = 0; i < plugins.length; i++) {
        var pluginWidth = plugins[i].getBoundingClientRect().width;
        if (pluginWidth > articleWidth) plugins[i].style.zoom = (articleWidth - PageHorizontalPadding) / pluginWidth;
    }
}

function articleHasScrolled() {
    if (ReaderJS.cachedNextPageURL && ReaderJS.canLoadNextPage()) ReaderJS.loadNextPage();
    ReaderJS.findTopVisibleNode();
}

function revealCachedTopVisibleNode() {
    if (ReaderJS.cachedTopVisibleNode) {
        var newRect = ReaderJS.cachedTopVisibleNode.getBoundingClientRect();
        var scrollTop = window.scrollY + newRect.top - newRect.height * ReaderJS.cachedTopVisibleNodeOffset;
        if (scrollTop > 0) document.body.scrollTop = scrollTop;
    }
}

function initializeMaxDistanceForLoadingNextPage() {
    var maxDistance = ReaderJSController.maxDistanceForLoadingNextPage;
    if (!maxDistance) maxDistance = ReaderJSController._isIPad ? 2048 : 1024;
    ReaderJSController._cachedMaxDistanceForLoadingNextPage = maxDistance;
}
var ReaderJS = new ReaderController();