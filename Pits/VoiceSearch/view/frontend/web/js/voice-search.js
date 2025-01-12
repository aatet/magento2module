/**
 * PIT Solutions
 *
 * NOTICE OF LICENSE
 * This source file is licenced under Webshop Extensions software license.
 * Once you have purchased the software with PIT Solutions AG or one of its
 * authorised resellers and provided that you comply with the conditions of this contract,
 * PIT Solutions AG grants you a non-exclusive license, unlimited in time for the usage of
 * the software in the manner of and for the purposes specified in the documentation according
 * to the subsequent regulations.
 *
 * @category Pits
 * @package  Pits_VoiceSearch
 * @author   Pit Solutions Pvt. Ltd.
 * @copyright Copyright (c) 2022 PIT Solutions AG. (www.pitsolutions.ch)
 * @license https://www.webshopextension.com/en/licence-agreement/
 */

define([
    'jquery',
    'mage/translate',
    'Magento_Customer/js/customer-data',
    'jquery-ui-modules/widget',
    'domReady!'
], function ($, $t, customerData) {
    'use strict';

    $.widget("pits.voiceSearch", {
        options: {
            searchInput: '#search',
            locale: 'en-US',
            skipSuggestions: 0,
            miniSearchForm: '#search_mini_form',
            speech : false,
        },

        /**
         * Initialize
         *
         * @private
         */
        _init: function () {
            this.element.on({
                click: this._onClick.bind(this)
            });
            $('[data-role=minisearch-label]').on({
                click: this._onClickSearchLabel.bind(this)
            });
        },

        /**
         * show/hide searchbar on search icon on mobile
         *
         * @param event
         * @private
         */
        _onClickSearchLabel: function (event){
            let $searchInput = $(this.options.searchInput);
            let $searchMiniForm = $(this.options.miniSearchForm);
            event.preventDefault();
            if(window.innerWidth < 768) {
                if (!$searchMiniForm.hasClass('active')) {
                    $searchMiniForm.addClass('active');
                    $searchMiniForm.find('label.label:first').addClass('active');
                    $searchInput.attr('aria-expanded', 'true');
                } else {
                    $searchMiniForm.removeClass('active');
                    $searchMiniForm.find('label.label:first').removeClass('active');
                    $searchInput.attr('aria-expanded', 'false');
                }
            }
        },

        /**
         * Handles the voice search results and form submit
         *
         * @param event
         * @private
         */
        _transcriptHandler: function (event){
            let $search = $(this.options.searchInput);
            let $miniSearchForm = $(this.options.miniSearchForm);
            $search.val();
            if (event.results.length) {
                var text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
                $search.val(text);
                if (event.results[0].isFinal) {
                    $miniSearchForm.trigger("submit");
                }
            } else {
                this._addErrorMessage(
                    $t('Unable to recognise.'),
                    'warning'
                );
            }
        },

        /**
         * Activate voice search on click
         *
         * @param event
         * @private
         */
        _onClick: function (event) {
            if (('webkitSpeechRecognition' || 'SpeechRecognition') in window) {
                let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                this.recognition.lang = this.options.locale;

                this.recognition.interimResults = true;
                this.recognition.onresult = this._transcriptHandler.bind(this);
                this.recognition.onspeechend = this._onSpeechEnd.bind(this);
                this.recognition.onerror = this._onError.bind(this);

                let $search = $(this.options.searchInput);
                event.preventDefault();
                this._setSearchActiveMobile(event);
                $search.val("");
                $search.attr("placeholder", $t('Listening...'));
                if (!this.options.speech) {
                    this.recognition.start();
                    this.options.speech = true;
                }
            } else {
                this._addErrorMessage(
                    $t("Speech Recognition is not supported in your browser or it has been disabled."),
                    'warning'
                );
            }
        },

        /**
         * Show searchbar on icon click in mobile
         *
         * @param event
         * @private
         */
        _setSearchActiveMobile: function (event) {
            if(window.innerWidth < 768) {
                let $searchInput = $(this.options.searchInput);
                let $searchMiniForm = $(this.options.miniSearchForm);
                event.preventDefault();
                if (!$searchMiniForm.hasClass('active')) {
                    $searchMiniForm.addClass('active');
                    $searchMiniForm.find('label.label:first').addClass('active');
                    $searchInput.attr('aria-expanded', 'true');
                }
            }
        },

        /**
         * Stop voice search
         *
         * @param event
         * @private
         */
        _onSpeechEnd: function (event) {
            this.options.speech = false;
            let $searchInput = $(this.options.searchInput);
            $searchInput.attr("placeholder", $t('Search entire store here...'));
            this.recognition.stop();
        },

        /**
         * Error handler
         *
         * @param event
         * @private
         */
        _onError: function (event) {
            let message = this._getErrorMessage(event);

            this._addErrorMessage(
                $t(message),
                'error'
            );
        },

        /**
         * Error message handler
         *
         * @param event
         * @returns {string}
         * @private
         */
        _getErrorMessage: function (event) {
            let errorCode = event.error,
                logError = false,
                message = '';

            switch (errorCode) {
                case 'no-speech':
                    message = 'No speech was detected.';
                    break;
                case 'not-allowed':
                    message = 'Unable to start voice search. Please check your browser permissions and allow this website to use the microphone.';
                    break;
                case 'language-not-supported':
                    message = 'Unfortunately, your language is not supported by speech to text services at this time.';
                    break;
                case 'aborted':
                    message = 'Voice capture has been aborted.';
                    break;
                case 'audio-capture':
                    message = 'Voice capture has failed.';
                    break;
                case 'network':
                    message = 'Network connectivity is required for voice input.';
                    break;
                default:
                    message = 'An error has occurred with the speech to text services.';
                    logError = true;
                    break;
            }

            if (logError && event.message) {
                console.error(event.message);
            }

            return message;
        },

        /**
         * printing error message
         *
         * @param message
         * @param type
         * @private
         */
        _addErrorMessage: function (message, type) {
            let customerMessages = customerData.get('messages')() || {},
                messages = customerMessages.messages || [];
            $(".page.messages .messages").empty();
            messages.push({
                text: message,
                type: type
            });

            customerMessages.messages = messages;

            customerData.set('messages', customerMessages);
            $(".messages .message").fadeOut(10000);
        }
    });

    return $.pits.voiceSearch;
});
