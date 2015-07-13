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
<div id="sub-hero" class="static-header blog-header light clearfix">
    <div class="text-heading">
        <h1>Blog</h1>
    </div>
</div>
<div id="home" style="padding-top:40px;">
    {%for post in collections.post %}   
    <div class="post_short">
        <h1><a href="/post/{{post.link}}">{{post.title}}</a></h1>
        <article>
            {{post.short}}
        </article>
    </div>
    {% endfor %}
</div>
{% endblock %}