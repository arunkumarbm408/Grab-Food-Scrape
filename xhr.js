
(function(xhr) {
    function handleLoad(xhrInstance) {
      const { response, responseURL } = xhrInstance;
  
      document.dispatchEvent(
        new CustomEvent('XHR_INTERCEPTED', {
          detail: {
            response,
            responseURL
          }
        })
      );
    }
  
    // Capture request before any network activity occurs:
    const send = xhr.send;
  
    xhr.send = function(data) {
      const rsc = this.onreadystatechange;
  
      this.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          handleLoad(this);
        }
  
        if (rsc) {
          return rsc.apply(this, arguments);
        }
      };
  
      return send.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype);
  
  