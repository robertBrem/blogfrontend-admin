'use strict';

angular.module('configuration', [])
    .constant('ENTRY_URL', 'http://localhost:8080/blogservice/resources/entries/')
    .constant('COMMENT_URL', 'http://localhost:8080/blogservice/resources/comments/');

/*
 angular.module('configuration', [])
 .constant('ENTRY_URL', 'http://104.167.98.125:8080/blogservice/resources/entries/')
 .constant('COMMENT_URL', 'http://104.167.98.125:8080/blogservice/resources/comments/');
 */