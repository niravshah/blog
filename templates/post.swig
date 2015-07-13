{% extends "layout/default.swig" %}


{% block nav%}
<nav class="navigation navigation-header">
    <div class="container">
        <div class="navigation-brand">
            <div class="brand-logo">
                <img src="/assets/img/speck-hdpi.png"/>           
                <span style="vertical-align:middle;">SPECKY</span>    
            </div>
            <button class="navigation-toggle visible-xs" type="button" data-toggle="dropdown" data-target=".navigation-navbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="navigation-navbar">        
            <ul class="navigation-bar navigation-bar-left">
                <li><a href="/sp/blog">Blog</a></li>
                <li>></li>
                <li class="active"><a href="">{{title}}</a></li>
            </ul>            
            <ul class="navigation-bar navigation-bar-right">
                <li><a href="/">Home</a></li>
                <li><a href="register.html">Login</a></li>
                <li class="featured"><a href="register.html">Sign up</a></li>
            </ul>  
        </div>
    </div>
 </nav>
{% endblock%}

{% block content %}
<div id="hero" class="static-header blog-header light clearfix">
    <div class="text-heading">
        <h1>{{title}}</h1>
    </div>
</div>
<div id="post">    
    <article>
        {{contents}}      
        <p>
            <span class="author">By <a rel="author" href="mailto:{{author.email}}">{{author.name}}</a></span> 
            on <time pubdate datetime="{{datetime}}">{{datetime}}</time>
        </p>
    </article>
</div>
{% endblock %}