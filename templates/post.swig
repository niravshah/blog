{% extends "layout/layout.swig" %}

{% block content %}
<div id="post">
    <h1>{{title}}</h1>
    <article>
        {{contents}}      
        <p>
            <span class="author">By <a rel="author" href="mailto:{{author.email}}">{{author.name}}</a></span> 
            on <time pubdate datetime="{{datetime}}">{{datetime}}</time>
        </p>
    </article>
</div>
{% endblock %}