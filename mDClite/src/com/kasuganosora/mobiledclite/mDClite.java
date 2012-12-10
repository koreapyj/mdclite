/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.kasuganosora.mobiledclite;

//import android.app.Activity;
import java.util.HashMap;
import java.util.Map;

import android.os.Bundle;
//import android.webkit.WebView;
import android.webkit.WebSettings;

import org.apache.cordova.*;

public class mDClite extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
    	Map<String, String> extraHeaders = new HashMap<String, String>();
    	extraHeaders.put("ACCEPT", "text/html");
    	
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");

        // Setting a custom user agent, so the application always fetches the same html as a desktop Chrome browser would
        WebSettings w = super.appView.getSettings();
        w.setUserAgentString("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1");
        
        //super.loadUrl("javascript:document.write('<script src=\'<!DOCTYPE html><html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" /><meta name=\"format-detection\" content=\"telephone=no\" /><meta name=\"viewport\" content=\"user-scalable=yes, initial-scale=1, maximum-scale=2, minimum-scale=1\" /><title>모바일 디시라이트</title><link rel=\"stylesheet\" href=\"css/index.css\" type=\"text/css\" charset=\"UTF-8\" media=\"all\" /><script src=\"cordova-2.2.0.js\" type=\"text/javascript\" charset=\"utf-8\"></script><script src=\"js/index.js\" type=\"text/javascript\" charset=\"utf-8\"></script>\'></script>')");
//        w.setSupportZoom(true);
//        w.setBuiltInZoomControls(true);
    }
}

