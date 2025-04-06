package server

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"os"
	"strings"
	"time"

	u "net/url"

	"github.com/foomo/simplecert"
	"github.com/foomo/tlsconfig"
)

var ReverseProxyBackend *httputil.ReverseProxy
var ReverseProxyWeb *httputil.ReverseProxy
var ReverseProxyDev *httputil.ReverseProxy

var BackendPort int = 8080
var WebPort int = 3000
var DevPort int = 3002

var BalancerGuid = os.Getenv("BALANCER_GUID")

func makeReverseProxy(port int, ws bool) *httputil.ReverseProxy {
	url, _ := u.Parse(fmt.Sprintf("http://172.16.0.2:%d", port))
	proxy := httputil.NewSingleHostReverseProxy(url)
	if ws {
		proxy.Director = func(req *http.Request) {
			req.URL.Scheme = url.Scheme
			req.URL.Host = url.Host
			if req.Header.Get("Connection") != "Upgrade" {
				req.Header.Set("Connection", "Upgrade")
				req.Header.Set("Upgrade", "websocket")
			}
		}
	}
	return proxy
}

func handleRequest(writer http.ResponseWriter, request *http.Request) {
	//path := request.URL.Path
	//request.Header.Get("X-CSRF-Token")
	request.Header.Set("X-Forwarded-Proto", "https")
	ip := request.RemoteAddr
	tokens := strings.Split(ip, ":")
	if len(tokens) > 1 {
		request.Header.Set("X-Real-Ip", tokens[0])
	}

	host := request.Host
	if strings.Contains(host, "other") {
		ReverseProxyBackend.ServeHTTP(writer, request)
	} else if strings.Contains(host, "web") {
		ReverseProxyWeb.ServeHTTP(writer, request)
	} else if strings.Contains(host, "dev.") {
		ReverseProxyDev.ServeHTTP(writer, request)
	} else {
		ReverseProxyWeb.ServeHTTP(writer, request)
	}
}

func Serve() {
	domainList := "shellmates.andrewarrow.dev"
	ReverseProxyWeb = makeReverseProxy(WebPort, false)

	cfg := simplecert.Default
	cfg.Domains = strings.Split(domainList, ",")
	cfg.CacheDir = "/certs"
	cfg.SSLEmail = "oneone@gmail.com"
	certReloader, err := simplecert.Init(cfg, nil)
	if err != nil {
		fmt.Println("err", err)
		return
	}

	go http.ListenAndServe(":80", http.HandlerFunc(simplecert.Redirect))

	tlsconf := tlsconfig.NewServerTLSConfig(tlsconfig.TLSModeServerStrict)
	tlsconf.GetCertificate = certReloader.GetCertificateFunc()

	handler := http.HandlerFunc(handleRequest)

	s := &http.Server{
		Addr:      ":443",
		Handler:   handler,
		TLSConfig: tlsconf,
	}

	s.ListenAndServeTLS("", "")

	for {
		time.Sleep(time.Second)
	}
}
